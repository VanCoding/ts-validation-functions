import { mergeValidators, PropertyValue, Validate, ValidationError } from "..";

export function is<T, R = T>(
  check: (value: T) => boolean,
  errorMessage: string,
  ...subValidators: Validate<R>[]
) {
  const subValidator = mergeValidators(...subValidators);
  return (value: PropertyValue<T>): ValidationError[] => {
    return check(value.value)
      ? subValidator(value as any as PropertyValue<R>)
      : [{ description: errorMessage }];
  };
}

export function ifIs<T, R = T>(
  check: (value: T) => boolean,
  ...subValidators: Validate<R>[]
) {
  const subValidator = mergeValidators(...subValidators);
  return (value: PropertyValue<T>): ValidationError[] => {
    return check(value.value)
      ? subValidator(value as any as PropertyValue<R>)
      : [];
  };
}
