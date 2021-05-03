import callBind from "call-bind";
import define from "define-properties";

import requirePromise from "./requirePromise";
import implementation from "./implementation";
import getPolyfill from "./polyfill";
import shim from "./shim";

requirePromise();
const bound = callBind(getPolyfill());

// eslint-disable-next-line func-name-matching
const rebindable = function any<T>(this: unknown, iterable: Iterable<Promise<T>>): Promise<T> {
  // eslint-disable-next-line no-invalid-this
  return bound(typeof this === "undefined" ? Promise : this, iterable);
};

define(rebindable, {
  getPolyfill: getPolyfill,
  implementation: implementation,
  shim: shim
});

export = rebindable;
