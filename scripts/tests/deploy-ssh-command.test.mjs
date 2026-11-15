import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync, chmodSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const forced = fileURLToPath(new URL("../beast/devkofi-deploy-ssh", import.meta.url));
const deploy = fileURLToPath(new URL("../deploy.sh", import.meta.url));
const sha = "0123456789abcdef0123456789abcdef01234567";

// A stub sudo on PATH records what the forced command would have run as ubuntu.
const withStubSudo = (fn) => {
  const dir = mkdtempSync(join(tmpdir(), "devkofi-ssh-"));
  writeFileSync(join(dir, "sudo"), '#!/bin/sh\nprintf "%s\\n" "$@"\n');
  chmodSync(join(dir, "sudo"), 0o755);
  try {
    return fn(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
};
const request = (command) => withStubSudo((dir) => {
  const env = { PATH: `${dir}:/usr/bin:/bin` };
  if (command !== undefined) env.SSH_ORIGINAL_COMMAND = command;
  const result = spawnSync("/bin/sh", [forced], { env, encoding: "utf8" });
  return { status: result.status, argv: result.stdout.trim().split("\n").filter(Boolean) };
});
const runner = ["-n", "-u", "ubuntu", "/usr/local/sbin/devkofi-deploy-run"];

test("forwards a preflight check", () => {
  assert.deepEqual(request("check"), { status: 0, argv: [...runner, "check"] });
});

test("forwards a deployment of one exact commit, with or without its CI run", () => {
  assert.deepEqual(request(`deploy ${sha}`), { status: 0, argv: [...runner, "deploy", sha] });
  assert.deepEqual(request(`deploy ${sha} 43546870270`), { status: 0, argv: [...runner, "deploy", sha, "43546870270"] });
});

test("refuses everything else before sudo runs", () => {
  for (const command of [
    undefined, "", "bash", "check now", "deploy", "deploy main", `deploy ${sha.toUpperCase()}`,
    `deploy ${sha.slice(1)}`, `deploy ${sha}0`, `deploy ${sha};id`, `deploy ${sha} $(id)`,
    `deploy ${sha} 0`, `deploy ${sha} 01`, `deploy ${sha} 12 34`, `deploy ${sha} ${"9".repeat(21)}`,
    `deploy  ${sha}`, `rollback`, `deploy ${sha}\nid`,
  ]) {
    const result = request(command);
    assert.equal(result.status, 64, `accepted ${JSON.stringify(command)}`);
    assert.deepEqual(result.argv, [], `sudo ran for ${JSON.stringify(command)}`);
  }
});

test("deploy.sh rejects malformed automatic-release input before touching Docker or Git", () => {
  for (const env of [
    { DEVKOFI_EXPECTED_SHA: "main" },
    { DEVKOFI_EXPECTED_SHA: sha.toUpperCase() },
    { DEVKOFI_EXPECTED_SHA: sha, DEVKOFI_CI_RUN_ID: "1;id" },
    { DEVKOFI_CI_RUN_ID: "123" },
  ]) {
    // DEVKOFI_DOCKER=false makes any Docker call fail with exit 1, not 64.
    const result = spawnSync("bash", [deploy], { env: { ...process.env, ...env, DEVKOFI_DOCKER: "false" }, encoding: "utf8" });
    assert.equal(result.status, 64, `${JSON.stringify(env)}: ${result.stderr}`);
  }
  const check = spawnSync("bash", [deploy, "--check"], { env: { ...process.env, DEVKOFI_EXPECTED_SHA: sha, DEVKOFI_DOCKER: "false" }, encoding: "utf8" });
  assert.equal(check.status, 64, "an expected SHA is only valid for a deployment");
});
