import { test } from "node:test";
import assert from "node:assert/strict";
import { accepts, parseVersion, supports } from "../src/version";

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

test("2.13.0 and later reload schemata.toml; earlier versions do not", () => {
  assert.equal(supports([2, 13, 0]), true);
  assert.equal(supports([2, 13, 3]), true);
  assert.equal(supports([3, 0, 0]), true);
  assert.equal(supports([2, 12, 9]), false);
  assert.equal(supports([2, 0, 0]), false);
  assert.equal(supports([1, 9, 9]), false);
  assert.equal(supports([1, 2, 0]), false);
  assert.equal(supports([0, 8, 0]), false);
});

test("a dev build passes the floor; a tagged version must reach 2.13.0", () => {
  assert.equal(accepts("schemata 1.4.0-dev+abc\n"), true);
  assert.equal(accepts("schemata 2.0.0-rc.1-dev+abc"), true);
  assert.equal(accepts("schemata 1.4.0\n"), false);
  assert.equal(accepts("schemata 2.12.0"), false);
  assert.equal(accepts("schemata 2.13.0-rc.1"), true);
  assert.equal(accepts("schemata 2.13.0"), true);
});

test("output that is not a version line is refused", () => {
  assert.equal(accepts(""), false);
  assert.equal(accepts("command not found"), false);
});
