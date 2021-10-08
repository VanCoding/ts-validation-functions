import { is } from ".";
import { Validate } from "..";

export function notNull<T>(...validators: Validate<Exclude<T, null>>[]) {
  return is<T, Exclude<T, null>>(
    (value) => value !== null,
    "must not be null",
    ...validators
  );
}
