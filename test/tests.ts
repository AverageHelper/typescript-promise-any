import type { Test } from "tape";
import AggregateError = require("es-aggregate-error");

function assertArray(
  t: Test,
  value: Array<unknown>,
  length: number,
  assertType?: (arg: unknown) => void
): void {
  t.ok(Array.isArray(value), "value is an array");
  t.equal(value.length, length, `length is ${length}`);
  if (typeof assertType === "function") {
    value.forEach(val => {
      assertType(val);
    });
  }
}

export default function tests(any: typeof Promise.any, t: Test): void {
  if (typeof Promise !== "function") {
    return t.skip("No global Promise detected");
  }

  const a = {};
  const b = {};
  const c = {};

  t.test("empty iterable", st => {
    st.plan(2);
    // eslint-disable-next-line promise/prefer-await-to-then
    void any([]).then(
      () => {
        st.fail();
      },
      (error: AggregateError) => {
        st.equal(error instanceof AggregateError, true, "is an AggregateError");
        st.deepEqual(error.errors, []);
      }
    );
  });

  t.test("no promise values", st => {
    st.plan(1);
    // eslint-disable-next-line promise/prefer-await-to-then
    void any([a, b, c]).then(result => {
      st.deepEqual(result, a);
    });
  });

  t.test("all fulfilled", st => {
    st.plan(1);
    // eslint-disable-next-line promise/prefer-await-to-then
    void any([Promise.resolve(a), Promise.resolve(b), Promise.resolve(c)]).then(result => {
      st.deepEqual(result, a);
    });
  });

  t.test("all rejected", st => {
    st.plan(2);
    // eslint-disable-next-line promise/prefer-await-to-then
    void any([Promise.reject(a), Promise.reject(b), Promise.reject(c)]).then(
      () => {
        st.fail();
      },
      (error: AggregateError) => {
        st.equal(error instanceof AggregateError, true, "is an AggregateError");
        st.deepEqual(error.errors, [a, b, c]);
      }
    );
  });

  t.test("mixed", st => {
    st.plan(2);
    // eslint-disable-next-line promise/prefer-await-to-then
    void any([a, Promise.resolve(b), Promise.reject(c)]).then(result => {
      st.deepEqual(result, a);
    });

    // eslint-disable-next-line promise/prefer-await-to-then
    void any<unknown>([Promise.reject(a), Promise.resolve(b), Promise.reject(c)]).then(result => {
      st.deepEqual(result, b);
    });
  });

  t.test("poisoned .then", st => {
    st.plan(2);
    const poison = new EvalError("Testing with poison");
    const promise = new Promise(() => undefined);
    // eslint-disable-next-line promise/prefer-await-to-then
    promise.then = (): never => {
      throw poison;
    };
    // eslint-disable-next-line promise/prefer-await-to-then
    void any([promise]).then(
      () => {
        st.fail("should not reach here");
      },
      (error: AggregateError) => {
        st.equal(error instanceof AggregateError, true, "error is an AggregateError");
        st.deepEqual(error.errors, [poison], "rejection showed up as expected");
      }
    );
  });

  class PromiseSubclass<T> extends Promise<T> {
    static thenArgs: Array<unknown> = [];
    public thenArgs: Array<unknown>;

    constructor(
      executor: (
        resolve: (value: T | PromiseLike<T>) => void,
        reject: (reason?: unknown) => void
      ) => void
    ) {
      super(executor);
      this.thenArgs = [];
    }
  }

  const Subclass: typeof PromiseSubclass = (function Subclass(): typeof PromiseSubclass {
    try {
      // eslint-disable-next-line no-new-func, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-implied-eval, unicorn/new-for-builtins
      return Function(
        "class Subclass extends Promise { constructor(...args) { super(...args); this.thenArgs = []; } then(...args) { Subclass.thenArgs.push(args); this.thenArgs.push(args); return super.then(...args); } } Subclass.thenArgs = []; return Subclass;"
      )();
    } catch (error: unknown) {
      throw new Error(`Exec failed: ${JSON.stringify(error, undefined, 2)}`);
    }
  })();

  t.test("inheritance", st => {
    st.test("preserves correct subclass", s2t => {
      const promise = any.call(Subclass, [1]);
      s2t.ok(promise instanceof Subclass, "promise is instanceof Subclass");
      s2t.equal(promise.constructor, Subclass, "promise.constructor is Subclass");

      s2t.end();
    });

    st.test("invokes the subclass’ then", s2t => {
      Subclass.thenArgs.length = 0;

      const original: typeof Subclass = (Subclass.resolve() as unknown) as typeof Subclass;
      assertArray(s2t, Subclass.thenArgs, 0);
      assertArray(s2t, original.thenArgs, 0);

      void any.call(Subclass, [original]);

      assertArray(s2t, original.thenArgs, 1);
      assertArray(s2t, Subclass.thenArgs, 3);

      s2t.end();
    });
  });

  return t.comment("tests completed");
}
