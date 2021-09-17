import { mergeValidators, PropertyValue, Validate, ValidationError } from "..";

function validateString<T>(
  required: boolean,
  ...validators: Validate<string>[]
): Validate<T> {
  const validator = mergeValidators(...validators);
  return (value: PropertyValue<T>): ValidationError[] => {
    if (typeof value.value !== "string") {
      if (required) {
        return [{ description: "must be a string" }];
      } else {
        return [];
      }
    } else {
      return validator(value as any as PropertyValue<string>);
    }
  };
}

export function isString<T>(...validators: Validate<string>[]) {
  return validateString<T>(true, ...validators);
}

export function ifString<T>(...validators: Validate<string>[]) {
  return validateString<T>(false, ...validators);
}

export function minLength(length: number) {
  return (value: PropertyValue<string>): ValidationError[] => {
    if (value.value.length < length) return [{ description: "must be longer" }];
    return [];
  };
}

export function maxLength(length: number) {
  return (value: PropertyValue<string>): ValidationError[] => {
    if (value.value.length > length)
      return [{ description: "must be shorter" }];
    return [];
  };
}
