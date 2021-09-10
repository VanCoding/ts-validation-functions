import { mergeValidators, PropertyValue, Validate } from "..";

function validateProperty<T extends { [key: string]: any }, P extends keyof T>(
  name: P,
  required: boolean,
  ...validators: Validate<T[P]>[]
) {
  const subValidator = mergeValidators(...validators);
  return (value: PropertyValue<T>) => {
    if (!value.value || !value.value.hasOwnProperty(name)) {
      if (required) {
        return [
          {
            path: name,
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

export function ifProperty<T extends { [key: string]: any }, P extends keyof T>(
  name: P,
  ...validators: Validate<T[P]>[]
) {
  return validateProperty(name, false, ...validators);
}

export function hasProperty<
  T extends { [key: string]: any },
  P extends keyof T
>(name: P, ...validators: Validate<T[P]>[]) {
  return validateProperty(name, true, ...validators);
}
