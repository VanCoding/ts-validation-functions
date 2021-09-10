# ts-validation-functions

A small validation library primarily targeted at form validation

## goals

- Generate a validator based on an existing Type
- Make it as composable as possible
- Infer types whenever possible
- Produce errors that can be used by forms

## example

```ts
type Person = {
  firstname: string;
  lastname: string;
  salutation?: string;
  age: number;
  cars: Car[];
};

type Car = {
  name: string;
  horsepower?: number;
};

const isCar = mergeValidators<Car>(
  hasProperty("name", minLength(1), maxLength(10)),
  ifProperty("horsepower", min(10), max(500))
);

const isName = mergeValidators<string>(minLength(1), maxLength(50));

const isPerson = mergeValidators<Person>(
  hasProperty("firstname", isName),
  hasProperty("lastname", isName),
  ifProperty("salutation", minLength(1), maxLength(10)),
  hasProperty("cars", each(isCar))
);

const errors = validate({
  firstname: "John",
  lastname: "Doe",
  salutation: "Mr",
  age: 10,
  cars: [
    {
      name: "Ferrari",
    },
    {
      name: "Ford",
      horsepower: 100,
    },
  ],
});
```
