import { ifIs, is } from ".";
import { Validate } from "..";

function _isNumber<T>(value: T) {
  return typeof value === "number";
}

export function ifNumber(...validators: Validate<number>[]) {
  return ifIs(_isNumber, ...validators);
}

export function isNumber(...validators: Validate<number>[]) {
  return is(_isNumber, "must be a number", ...validators);
}

export function min(minValue: number) {
  return is<number>((value) => value >= minValue, "must be greater");
}

export function max(maxValue: number) {
  return is<number>((value) => value <= maxValue, "must be lower");
}
