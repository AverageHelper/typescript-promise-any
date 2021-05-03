export = function requirePromise(): void {
  if (typeof Promise !== "function") {
    throw new TypeError("`typescript-promise-any` requires a global `Promise` be available.");
  }
};
