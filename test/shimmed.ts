import shim = require("../src/shim");
shim();

import test = require("tape");
import runTests from "./builtin";

test("shimmed", t => {
  runTests(t);

  t.end();
});
