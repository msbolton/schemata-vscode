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

test("0.8.0 and later have the language server; earlier versions do not", () => {
  assert.equal(supports([0, 8, 0]), true);
  assert.equal(supports([0, 9, 1]), true);
  assert.equal(supports([1, 0, 0]), true);
  assert.equal(supports([0, 7, 9]), false);
  assert.equal(supports([0, 7, 0]), false);
});

test("a development build is supported by the version it follows", () => {
  assert.equal(supports(parseVersion("schemata 0.7.0-dev+abc")!), false);
  assert.equal(supports(parseVersion("schemata 0.8.0-dev+abc")!), true);
});
