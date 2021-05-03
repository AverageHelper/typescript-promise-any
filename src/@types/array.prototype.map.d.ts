declare module "array.prototype.map" {
  export default function map<T, U>(
    array: Array<T>,
    callbackfn: (value: T, index: number, array: Array<T>) => U
  ): Array<U>;
}
