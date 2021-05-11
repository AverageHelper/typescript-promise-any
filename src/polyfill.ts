import requirePromise = require("./requirePromise");
import implementation = require("./implementation");

export = function getPolyfill(): typeof Promise.any {
  requirePromise();
  // eslint-disable-next-line @typescript-eslint/unbound-method
  return typeof Promise.any === "function" ? Promise.any : implementation;
};
