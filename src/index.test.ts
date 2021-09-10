import { mergeValidators, validate, Validators } from "../src";
const {
  maxLength,
  ifProperty,
  minLength,
  isString,
  hasProperty,
  each,
  hasIndex,
  isNumber,
  min,
  max,
} = Validators;
describe("example", () => {
  it("works", () => {
    type Person = {
      name?: string;
      age?: number;
      cars: Array<{
        name: string;
        seats: number;
      }>;
    };

    const errors = validate<Person>(
      {
        cars: [
          { name: "Ferrari", seats: 2 },
          { name: "Bus", seats: 10 },
        ],
      },
      hasProperty("name", isString(minLength(10))),
      ifProperty("age", isNumber(min(10))),
      hasProperty(
        "cars",
        each(hasProperty("name", minLength(4), maxLength(5))),
        hasIndex(2),
        hasIndex(1, hasProperty("seats", min(4), max(6)))
      )
    );

    expect(errors).toEqual([
      {
        description: "must be defined",
        path: "name",
      },
      {
        description: "must be shorter",
        path: "cars.0.name",
      },
      {
        description: "must be longer",
        path: "cars.1.name",
      },
      {
        description: "index does not exist",
        path: "cars.2",
      },
      {
        description: "must be lower",
        path: "cars.1.seats",
      },
    ]);
  });
});
