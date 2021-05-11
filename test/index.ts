import any = require("../src");
import test = require("tape");
import runTests from "./tests";

test("as a function", t => {
  t.test("bad Promise/this value", st => {
    // below test is skipped, because for convenience, i'm explicitly turning `undefined` into `Promise` in the main export

    // st['throws'](function () { any.call(undefined); }, TypeError, 'undefined is not an object');

    st["throws"](
      () => {
        // eslint-disable-next-line no-useless-call
        void any.call(null, (undefined as unknown) as Iterable<never>);
      },
      TypeError,
      "null is not an object"
    );
    st.end();
  });

  runTests(any, t);

  t.end();
});
