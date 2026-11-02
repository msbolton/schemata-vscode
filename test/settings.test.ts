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
