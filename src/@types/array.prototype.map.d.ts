declare module "array.prototype.map" {
  declare const map: <T, U>(
    array: Array<T>,
    callbackfn: (value: T, index: number, array: Array<T>) => U
  ) => Array<U>;
  export = map;
}
