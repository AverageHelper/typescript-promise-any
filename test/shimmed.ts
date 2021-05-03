import shim from "../src/shim";
shim();

import test from "tape";
import runTests from "./builtin";

test("shimmed", t => {
  runTests(t);

  t.end();
});
