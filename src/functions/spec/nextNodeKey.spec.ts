import { expect, test } from "vitest";
import { nextNodeKey } from "@/functions/nextNodeKey";
test("nextNodeKey", () => {
  expect(nextNodeKey("0")).toBe("1");
  expect(nextNodeKey("1")).toBe("2");
  expect(nextNodeKey("1_1")).toBe("1_2");
  expect(nextNodeKey("1_1_1")).toBe("1_1_2");
});
