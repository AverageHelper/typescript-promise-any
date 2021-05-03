/* eslint-disable unicorn/filename-case */

declare module "es-aggregate-error" {
  export default class AggregateError extends Error implements NodeJS.ErrnoException {
    errors: Array<unknown>;

    constructor(errors: Array<unknown>, message?: string);
  }
}
