import "source-map-support/register";
import callBind = require("call-bind");
import define = require("define-properties");

import AggregateError = require("es-aggregate-error");
import requirePromise = require("./requirePromise");
import implementation = require("./implementation");
import getPolyfill = require("./polyfill");
import shim = require("./shim");

requirePromise();
const bound = callBind(getPolyfill());

interface Rebindable {
  AggregateError: typeof AggregateError;
  getPolyfill: typeof getPolyfill;
  implementation: typeof implementation;
  shim: typeof shim;
  <T>(this: unknown, iterable: Iterable<Promise<T>>): Promise<T>;
}

// eslint-disable-next-line func-name-matching
const rebindable: Rebindable = function any<T>(
  this: unknown,
  iterable: Iterable<Promise<T>>
): Promise<T> {
  // eslint-disable-next-line no-invalid-this
  return bound(typeof this === "undefined" ? Promise : this, iterable);
} as Rebindable;

define(rebindable, {
  AggregateError: AggregateError,
  getPolyfill: getPolyfill,
  implementation: implementation,
  shim: shim
});

export = rebindable;
