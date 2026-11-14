import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const lib = fileURLToPath(new URL("../deploy-compose-label.sh", import.meta.url));
const root = "/home/ubuntu/projects/devkofi";
const state = `${root}/.deploy-state`;

const classify = (label) => {
  const result = spawnSync(
    "bash",
    ["-c", 'source "$1"; classify_compose_label "$2" "$3" "$4"', "bash", lib, root, state, label],
    { encoding: "utf8" },
  );
  return { status: result.status, kind: result.stdout.trim() };
};

test("accepts the base compose.yaml", () => {
  assert.deepEqual(classify(`${root}/compose.yaml`), { status: 0, kind: "base" });
});

// Regression: deploy.sh cutover labels containers with this pair, which preflight used to reject.
test("accepts the candidate overlay left by a deploy.sh cutover", () => {
  assert.deepEqual(classify(`${root}/compose.yaml,${state}/candidate.yaml`), { status: 0, kind: "overlay" });
});

test("accepts the rollback overlay left by deploy:rollback", () => {
  assert.deepEqual(classify(`${root}/compose.yaml,${state}/rollback.yaml`), { status: 0, kind: "overlay" });
});

test("treats a single external Compose file as the migration path", () => {
  assert.deepEqual(classify("/home/ubuntu/apps/devkofi-docker/compose.yaml"), { status: 0, kind: "external" });
});

test("rejects unexpected Compose file combinations", () => {
  for (const label of [
    "",
    `${root}/compose.yaml,${state}/active.yaml`,
    `${root}/compose.yaml,/tmp/candidate.yaml`,
    `/elsewhere/compose.yaml,${state}/candidate.yaml`,
    `${root}/compose.yaml,${state}/candidate.yaml,${state}/rollback.yaml`,
    `${state}/candidate.yaml,${root}/compose.yaml`,
  ]) {
    assert.equal(classify(label).status, 1, `expected rejection for "${label}"`);
  }
});

test("matches paths literally, not as glob patterns", () => {
  const globRoot = "/srv/dev*";
  const result = spawnSync(
    "bash",
    ["-c", 'source "$1"; classify_compose_label "$2" "$2/.deploy-state" "$3"', "bash", lib, globRoot, "/srv/devkofi/compose.yaml"],
    { encoding: "utf8" },
  );
  assert.equal(result.stdout.trim(), "external");
});
