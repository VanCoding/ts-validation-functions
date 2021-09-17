import { mergeValidators, PropertyValue, Validate, ValidationError } from "..";

type ObjectOnly<T> = Extract<T, object>;

function validateObject<T, R extends ObjectOnly<T>>(
  required: boolean,
  ...validators: Validate<ObjectOnly<T>>[]
) {
  const subValidator = mergeValidators(...validators);
  return (value: PropertyValue<T>): ValidationError[] => {
    if (typeof value.value !== "object") {
      if (required) {
        return [{ description: "must be an object" }];
      } else {
        return [];
      }
    } else {
      return subValidator(value as PropertyValue<R>);
    }
  };
}

export function isObject<T>(
  ...validators: Validate<ObjectOnly<T>>[]
): Validate<T> {
  return validateObject(true, ...validators);
}

export function ifObject<T>(
  ...validators: Validate<ObjectOnly<T>>[]
): Validate<T> {
  return validateObject(false, ...validators);
}

function validateProperty<T extends object, P extends keyof T>(
  name: P,
  required: boolean,
  ...validators: Validate<Required<T>[P]>[]
): Validate<T> {
  const subValidator = mergeValidators(...validators);
  return (value: PropertyValue<T>) => {
    if (!value.value || !value.value.hasOwnProperty(name)) {
      if (required) {
        return [
          {
            path: String(name),
            description: "must be defined",
          },
        ];
      } else {
        return [];
      }
    }
    return subValidator({
      name: String(name),
      value: value.value[name],
    }).map((error) => ({
      ...error,
      path: name + (error.path ? "." + error.path : ""),
    }));
  };
}

export function ifProperty<T extends object, P extends keyof T>(
  name: P,
  ...validators: Validate<Required<T>[P]>[]
): Validate<T> {
  return validateProperty<T, P>(name, false, ...validators);
}

export function hasProperty<T extends object, P extends keyof T>(
  name: P,
  ...validators: Validate<Required<T>[P]>[]
): Validate<T> {
  return validateProperty<T, P>(name, true, ...validators);
}
