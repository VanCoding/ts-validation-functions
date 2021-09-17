import { mergeValidators, PropertyValue, Validate, ValidationError } from "..";

function validateNumber<T>(
  required: boolean,
  ...validators: Validate<number>[]
) {
  const validator = mergeValidators(...validators);
  return (value: PropertyValue<T>): ValidationError[] => {
    if (typeof value.value !== "number") {
      if (required) {
        return [{ description: "must be a number" }];
      } else {
        return [];
      }
    } else {
      return validator(value as any as PropertyValue<number>);
    }
  };
}

export function ifNumber<T>(...validators: Validate<number>[]) {
  return validateNumber(false, ...validators);
}

export function isNumber<T>(...validators: Validate<number>[]) {
  return validateNumber(true, ...validators);
}

export function min(minValue: number) {
  return (value: PropertyValue<number>): ValidationError[] => {
    if (value.value < minValue) return [{ description: "must be greater" }];
    return [];
  };
}

export function max(maxValue: number) {
  return (value: PropertyValue<number>): ValidationError[] => {
    if (value.value > maxValue) return [{ description: "must be lower" }];
    return [];
  };
}
