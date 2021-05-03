import requirePromise from "./requirePromise";
import implementation from "./implementation";

export = function getPolyfill(): typeof Promise.any {
  requirePromise();
  // eslint-disable-next-line @typescript-eslint/unbound-method
  return typeof Promise.any === "function" ? Promise.any : implementation;
};
