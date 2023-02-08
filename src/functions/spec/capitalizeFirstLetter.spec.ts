import { expect, test } from "vitest";
import { capitalizeFirstLetter } from "@/functions/capitalizeFirstLetter";

test("capitalizeFirstLetter", () => {
  expect(capitalizeFirstLetter("H")).toBe("H");
  expect(capitalizeFirstLetter("d")).toBe("D");
});
