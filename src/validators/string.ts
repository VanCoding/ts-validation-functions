import { mergeValidators, PropertyValue, Validate, ValidationError } from "..";

function validateString(
  required: boolean,
  ...validators: Validate<string>[]
): Validate<any> {
  const validator = mergeValidators(...validators);
  return (value: PropertyValue<any>): ValidationError[] => {
    if (typeof value.value !== "string") {
      if (required) {
        return [{ description: "must be a string" }];
      } else {
        return [];
      }
    } else {
      return validator(value as PropertyValue<string>);
    }
  };
}

export function isString(...validators: Validate<string>[]) {
  return validateString(true, ...validators);
}

export function ifString(...validators: Validate<string>[]) {
  return validateString(false, ...validators);
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
