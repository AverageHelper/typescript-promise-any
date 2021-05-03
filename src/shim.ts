import requirePromise from "./requirePromise";
import getPolyfill from "./polyfill";
import define from "define-properties";

export = function shimAny(): typeof Promise.any {
  requirePromise();

  const polyfill = getPolyfill();
  define(Promise, { any: polyfill }, {
    // eslint-disable-next-line func-name-matching
    any: function testAny() {
      return Promise.any !== polyfill;
    }
  });
  return polyfill;
};
