import { test } from "node:test";
import assert from "node:assert/strict";
import { parseVersion, supports } from "../src/version";

test("a release version parses to its three numbers", () => {
  assert.deepEqual(parseVersion("schemata 0.8.0\n"), [0, 8, 0]);
  assert.deepEqual(parseVersion("schemata 1.12.3"), [1, 12, 3]);
});

test("a development build parses to the version it follows", () => {
  assert.deepEqual(parseVersion("schemata 0.8.0-dev+abc1234\n"), [0, 8, 0]);
});

test("output that is not a version line does not parse", () => {
  assert.equal(parseVersion(""), undefined);
  assert.equal(parseVersion("command not found"), undefined);
  assert.equal(parseVersion("schemata x.y.z"), undefined);
});

test("2.0.0 and later read the 2.0 syntax; 1.x does not", () => {
  assert.equal(supports([2, 0, 0]), true);
  assert.equal(supports([2, 1, 3]), true);
  assert.equal(supports([3, 0, 0]), true);
  assert.equal(supports([1, 9, 9]), false);
  assert.equal(supports([1, 2, 0]), false);
  assert.equal(supports([0, 8, 0]), false);
});

test("a development build is supported by the version it follows", () => {
  assert.equal(supports(parseVersion("schemata 1.4.0-dev+abc")!), false);
  assert.equal(supports(parseVersion("schemata 2.0.0-dev+abc")!), true);
  assert.equal(supports(parseVersion("schemata 2.0.0-rc.1")!), true);
});
