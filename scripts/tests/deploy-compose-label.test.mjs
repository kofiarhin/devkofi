import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const lib = fileURLToPath(new URL("../deploy-compose-label.sh", import.meta.url));
const root = "/home/ubuntu/projects/devkofi";
const state = `${root}/.deploy-state`;

const classifyIn = (checkout, label, legacy = "") => {
  const result = spawnSync(
    "bash",
    ["-c", 'source "$1"; classify_compose_label "$2" "$3" "$4" "$5"', "bash", lib, checkout, `${checkout}/.deploy-state`, label, legacy],
    { encoding: "utf8" },
  );
  return { status: result.status, kind: result.stdout.trim() };
};
const classify = (label) => classifyIn(root, label);

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

// Migration from the shared projects checkout to the private deploy checkout.
const deployRoot = "/home/ubuntu/deploy/devkofi";

test("works for a checkout outside /home/ubuntu/projects", () => {
  assert.deepEqual(classifyIn(deployRoot, `${deployRoot}/compose.yaml,${deployRoot}/.deploy-state/candidate.yaml`), { status: 0, kind: "overlay" });
});

test("accepts the previous checkout's labels only when it is configured as legacy", () => {
  for (const label of [
    `${root}/compose.yaml`,
    `${root}/compose.yaml,${state}/candidate.yaml`,
    `${root}/compose.yaml,${state}/rollback.yaml`,
  ]) {
    assert.deepEqual(classifyIn(deployRoot, label, root), { status: 0, kind: "legacy" }, label);
    assert.notEqual(classifyIn(deployRoot, label).kind, "legacy", `unconfigured legacy accepted ${label}`);
  }
});

test("rejects spoofed legacy labels", () => {
  for (const label of [
    `${root}/compose.yaml,${state}/active.yaml`,
    `${root}/compose.yaml,/tmp/candidate.yaml`,
    `${root}/compose.yaml,${deployRoot}/.deploy-state/candidate.yaml`,
    `${root}/compose.yaml,${state}/candidate.yaml,${state}/rollback.yaml`,
  ]) {
    assert.equal(classifyIn(deployRoot, label, root).status, 1, label);
  }
});

test("ignores a relative or self-referencing legacy root", () => {
  assert.equal(classifyIn(deployRoot, "projects/devkofi/compose.yaml,projects/devkofi/.deploy-state/candidate.yaml", "projects/devkofi").status, 1);
  assert.deepEqual(classifyIn(root, `${root}/compose.yaml`, root), { status: 0, kind: "base" });
});
