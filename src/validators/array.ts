import { ifIs, is } from ".";
import { mergeValidators, PropertyValue, Validate, ValidationError } from "..";

type ArrayOnly<T> = Extract<T, any[]>;

function _isArray(value: any) {
  return value instanceof Array;
}

export function ifArray<T>(
  ...validators: Validate<ArrayOnly<T>>[]
): Validate<T> {
  return ifIs(_isArray, ...validators);
}

export function isArray<T>(
  ...validators: Validate<ArrayOnly<T>>[]
): Validate<T> {
  return is(_isArray, "must be an array", ...validators);
}

export function each<T>(...validators: Validate<T>[]): Validate<T[]> {
  const subvalidator = mergeValidators(...validators);
  return (value: PropertyValue<T[]>): ValidationError[] => {
    return value.value
      .map((item, index) =>
        subvalidator({
          name: index + "",
          value: item,
        }).map((err) => ({
          ...err,
          path: index + "" + (err.path ? "." + err.path : ""),
        }))
      )
      .flat();
  };
}

function validateIndex<T>(
  index: number,
  required: boolean,
  ...validators: Validate<T>[]
): Validate<T[]> {
  const subvalidator = mergeValidators(...validators);
  return (value: PropertyValue<T[]>): ValidationError[] => {
    if (index >= value.value.length) {
      if (required) {
        return [{ description: "index does not exist", path: index + "" }];
      } else {
        return [];
      }
    }
    return subvalidator({
      name: index + "",
      value: value.value[index],
    }).map((err) => ({
      ...err,
      path: index + "" + (err.path ? "." + err.path : ""),
    }));
  };
}

export function ifIndex<T>(
  index: number,
  ...validators: Validate<T>[]
): Validate<T[]> {
  return validateIndex(index, false, ...validators);
}

export function hasIndex<T>(
  index: number,
  ...validators: Validate<T>[]
): Validate<T[]> {
  return validateIndex(index, true, ...validators);
}
