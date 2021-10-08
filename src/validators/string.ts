import { ifIs, is } from ".";
import { Validate } from "..";

function _isString<T>(value: T) {
  return typeof value === "string";
}

export function isString<T>(...validators: Validate<string>[]) {
  return is(_isString, "must be a string", ...validators);
}

export function ifString<T>(...validators: Validate<string>[]) {
  return ifIs(_isString, ...validators);
}

export function minLength(length: number) {
  return is<string>((value) => value.length >= length, "must be longer");
}

export function maxLength(length: number) {
  return is<string>((value) => value.length <= length, "must be shorter");
}
