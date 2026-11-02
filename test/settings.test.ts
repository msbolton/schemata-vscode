import { strict as assert } from "node:assert";
import { test } from "node:test";
import { initializationOptions } from "../src/settings";

test("nothing set sends nothing", () => {
  assert.deepEqual(initializationOptions(undefined, undefined), {});
  assert.deepEqual(
    initializationOptions({ key: "schemata.roots", defaultValue: [] }, { key: "schemata.strict", defaultValue: false }),
    {},
  );
});

test("a value set at any scope is sent, the narrowest winning", () => {
  assert.deepEqual(
    initializationOptions(
      { key: "schemata.roots", defaultValue: [], globalValue: ["a"], workspaceFolderValue: ["b"] },
      { key: "schemata.strict", defaultValue: false, workspaceValue: false },
    ),
    { roots: ["b"], strict: false },
  );
});

test("a workspace value beats a global one", () => {
  assert.deepEqual(
    initializationOptions(
      { key: "schemata.roots", defaultValue: [], globalValue: ["a"], workspaceValue: ["w"] },
      { key: "schemata.strict", defaultValue: false, globalValue: true, workspaceValue: false },
    ),
    { roots: ["w"], strict: false },
  );
});

test("a global-only value is sent", () => {
  assert.deepEqual(
    initializationOptions(
      { key: "schemata.roots", defaultValue: [], globalValue: ["g"] },
      { key: "schemata.strict", defaultValue: false, globalValue: true },
    ),
    { roots: ["g"], strict: true },
  );
});
