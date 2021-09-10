export * as Validators from "./validators";

export type PropertyValue<T> = {
  name: string;
  value: T;
};
export type ValidationError = {
  path?: string;
  description?: string;
  data?: any;
};

export type Validate<T> = (value: PropertyValue<T>) => ValidationError[];

export function mergeValidators<T>(...validators: Validate<T>[]) {
  return (value: PropertyValue<T>) =>
    validators.map((validator) => validator(value)).flat();
}

export function validate<T>(value: T, ...validators: Validate<T>[]) {
  return mergeValidators(...validators)({
    name: "",
    value,
  });
}
