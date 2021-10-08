import { validate, Validators } from "../src";
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
  isArray,
  ifObject,
  ifString,
  is,
} = Validators;
describe("example", () => {
  it("works", () => {
    type Person = {
      name?: string;
      age?: number;
      cars?: Array<{
        name: string;
        seats: number;
      }> | null;
      metadata?: string | { text: string };
    };

    const errors = validate<Person>(
      {
        cars: [
          { name: "Ferrari", seats: 2 },
          { name: "Bus", seats: 10 },
        ],
        metadata: { text: "hello" },
      },
      hasProperty("name", isString()),
      ifProperty("age", isNumber(min(10))),
      hasProperty(
        "cars",
        isArray<Person["cars"]>(
          each(hasProperty("name", minLength(4), maxLength(5))),
          hasIndex(2),
          hasIndex(1, hasProperty("seats", min(4), max(6)))
        )
      ),
      ifProperty(
        "metadata",
        ifString(maxLength(100)),
        ifObject<Person["metadata"]>(
          hasProperty(
            "text",
            minLength(10),
            is((v) => v == "world", "must be 'world'")
          )
        )
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
      {
        description: "must be longer",
        path: "metadata.text",
      },
      {
        description: "must be 'world'",
        path: "metadata.text",
      },
    ]);
  });
});
