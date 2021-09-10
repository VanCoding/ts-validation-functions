import { mergeValidators, PropertyValue, Validate, ValidationError } from "..";

function validateArray<T>(required: boolean, ...validators: Validate<T[]>[]) {
  const subValidator = mergeValidators(...validators);
  return (value: PropertyValue<T[]>): ValidationError[] => {
    if (!(value.value instanceof Array)) {
      if (required) {
        return [{ description: "must be an array" }];
      } else {
        return [];
      }
    } else {
      return subValidator(value as PropertyValue<T[]>);
    }
  };
}

export function ifArray<T>(...validators: Validate<T[]>[]) {
  return validateArray(false, ...validators);
}

export function isArray<T>(...validators: Validate<T[]>[]) {
  return validateArray(true, ...validators);
}

export function each<T extends any[]>(...validators: Validate<T[number]>[]) {
  const subvalidator = mergeValidators(...validators);
  return (value: PropertyValue<T>): ValidationError[] => {
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

function validateIndex<T extends any[]>(
  index: number,
  required: boolean,
  ...validators: Validate<T[number]>[]
) {
  const subvalidator = mergeValidators(...validators);
  return (value: PropertyValue<T>): ValidationError[] => {
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

export function ifIndex<T extends any[]>(
  index: number,
  ...validators: Validate<T[number]>[]
) {
  return validateIndex(index, false, ...validators);
}

export function hasIndex<T extends any[]>(
  index: number,
  ...validators: Validate<T[number]>[]
) {
  return validateIndex(index, true, ...validators);
}
