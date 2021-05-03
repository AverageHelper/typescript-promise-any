import "source-map-support/register";
import callBind from "call-bind";

import AggregateError from "es-aggregate-error";
import requirePromise from "./requirePromise";
import implementation from "./implementation";
import getPolyfill from "./polyfill";
import shim from "./shim";

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

export { AggregateError, getPolyfill, implementation, shim };
export default rebindable;
