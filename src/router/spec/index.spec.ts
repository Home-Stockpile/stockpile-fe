import { describe, expect, test } from "vitest";
import router from "@/router";

describe("router", () => {
  test("if item doesn't exist router should redirect to default page", () => {
    router.push("/item/1_1_43");
    expect(router.currentRoute.value.fullPath).toBe("/");
  });
});
