import type { Test } from "tape";
import defineProperties from "define-properties";
// eslint-disable-next-line @typescript-eslint/unbound-method
const isEnumerable = Object.prototype.propertyIsEnumerable;

import checkFunctionsHaveNames from "functions-have-names";
const functionsHaveNames = checkFunctionsHaveNames();

import runTests from "./tests";

export default function builtin(t: Test): void {
  t.equal(Promise.any.length, 1, "Promise.any has a length of 1");
  t.test("Function name", { skip: !functionsHaveNames }, st => {
    st.equal(Promise.any.name, "any", 'Promise.any has name "any"');
    st.end();
  });

  t.test("enumerability", { skip: !defineProperties.supportsDescriptors }, et => {
    et.equal(false, isEnumerable.call(Promise, "any"), "Promise.any is not enumerable");
    et.end();
  });

  const supportsStrictMode = (function supportsStrictMode(this: unknown): boolean {
    return typeof this === "undefined";
  })();

  t.test("bad object value", { skip: !supportsStrictMode }, st => {
    st["throws"](
      () => {
        void Promise.any.call(undefined, (undefined as unknown) as Iterable<unknown>);
      },
      TypeError,
      "undefined is not an object"
    );
    st["throws"](
      () => {
        void Promise.any.call(null, (undefined as unknown) as Iterable<unknown>);
      },
      TypeError,
      "null is not an object"
    );
    st.end();
  });

  runTests(function any<T>(
    this: unknown,
    iterable: Array<T | PromiseLike<T>> | Iterable<T | PromiseLike<T>>
  ): Promise<T> {
    return Promise.any.call(typeof this === "undefined" ? Promise : this, iterable) as Promise<T>;
  },
  t);
}
