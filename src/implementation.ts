import requirePromise = require("./requirePromise");
requirePromise();

import AggregateError = require("es-aggregate-error");
import PromiseResolve = require("es-abstract/2018/PromiseResolve");
import { Type } from "es-abstract";
import callBind = require("call-bind");
import GetIntrinsic = require("get-intrinsic");
import iterate = require("iterate-value");
import map = require("array.prototype.map");

const all = callBind(GetIntrinsic("%Promise.all%"));
const reject = callBind(GetIntrinsic("%Promise.reject%"));

function identity<T>(x: T): T {
  return x;
}

export = function any<T>(
  this: unknown,
  iterable: Array<T | PromiseLike<T>> | Iterable<T | PromiseLike<T>>
): Promise<T> {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const C = this as PromiseConstructorLike;
  if (Type(C) !== "Object") {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return reject(C, new TypeError("`this` value must be an object")) as Promise<T>;
  }
  function thrower<U>(value: U): Promise<U> {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return reject(C, value) as Promise<U>;
  }
  return all(
    C,
    map(iterate(iterable), (item: T | PromiseLike<T>) => {
      const itemPromise = PromiseResolve(C, item);
      try {
        // eslint-disable-next-line promise/prefer-await-to-then
        return itemPromise.then(thrower, identity);
      } catch (error: unknown) {
        return error;
      }
    })
    // eslint-disable-next-line promise/prefer-await-to-then
  ).then(errors => {
    return reject(C, new AggregateError(errors, "Every promise rejected"));
  }, identity) as Promise<T>;
};
