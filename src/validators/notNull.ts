import { mergeValidators, PropertyValue, Validate, ValidationError } from "..";

export function notNull<T>(...validators: Validate<Exclude<T, null>>[]) {
  const subvalidator = mergeValidators(...validators);
  return (value: PropertyValue<T>): ValidationError[] => {
    if (value.value === null) return [{ description: "must not be null" }];
    return subvalidator(value as PropertyValue<Exclude<T, null>>);
  };
}
