import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { checkRelease, EXIT, REQUIRED_JOBS, REPO } = require("../check-ci.cjs");
const script = fileURLToPath(new URL("../check-ci.cjs", import.meta.url));
const ciYaml = readFileSync(new URL("../../.github/workflows/ci.yml", import.meta.url), "utf8");

const sha = "a".repeat(40);
const newer = "b".repeat(40);
const repo = { full_name: REPO };
const run = (overrides = {}) => ({
  id: 100, repository: repo, head_repository: repo, path: ".github/workflows/ci.yml",
  event: "push", head_branch: "main", head_sha: sha, status: "completed", conclusion: "success", ...overrides,
});
const jobs = (list = REQUIRED_JOBS.map((name) => ({ name, status: "completed", conclusion: "success" }))) => ({ total_count: list.length, jobs: list });
const json = (body, status = 200, headers = {}) => ({ status, headers: new Headers(headers), json: async () => body });

// Routes by path prefix; unknown paths fail the test loudly.
const github = ({ tip = sha, runs = [run()], runById = run(), jobList = jobs() } = {}) => {
  const calls = [];
  const fetchImpl = async (url) => {
    const path = new URL(url).pathname;
    calls.push(url);
    if (path === `/repos/${REPO}/git/ref/heads/main`) return json({ object: { sha: tip } });
    if (path === `/repos/${REPO}/actions/workflows/ci.yml/runs`) return json({ workflow_runs: runs });
    if (path === `/repos/${REPO}/actions/runs/${runById.id}`) return json(runById);
    if (/\/actions\/runs\/\d+\/jobs$/.test(path)) return json(jobList);
    throw new Error(`unexpected request ${url}`);
  };
  return { fetchImpl, calls };
};

test("passes the current main commit whose CI push run and every required job succeeded", async () => {
  const { fetchImpl, calls } = github();
  const result = await checkRelease({ sha, fetchImpl });
  assert.equal(result.code, EXIT.eligible, result.message);
  const runsUrl = new URL(calls[1]);
  assert.equal(runsUrl.searchParams.get("head_sha"), sha);
  assert.equal(runsUrl.searchParams.get("event"), "push");
  assert.equal(runsUrl.searchParams.get("branch"), "main");
});

test("checks the exact CI run when a run id is supplied", async () => {
  const { fetchImpl, calls } = github({ runById: run({ id: 4242 }) });
  assert.equal((await checkRelease({ sha, runId: "4242", fetchImpl })).code, EXIT.eligible);
  assert.ok(calls.some((url) => url.endsWith("/actions/runs/4242")));
});

test("refuses a commit that is no longer the tip of main as stale", async () => {
  const { fetchImpl, calls } = github({ tip: newer });
  const result = await checkRelease({ sha, fetchImpl });
  assert.equal(result.code, EXIT.stale);
  assert.equal(calls.length, 1, "no CI lookup after a stale tip");
});

test("refuses failed, cancelled, skipped, neutral or unfinished CI runs", async () => {
  for (const overrides of [
    { conclusion: "failure" }, { conclusion: "cancelled" }, { conclusion: "skipped" },
    { conclusion: "neutral" }, { status: "in_progress", conclusion: null },
  ]) {
    const { fetchImpl } = github({ runs: [run(overrides)] });
    assert.equal((await checkRelease({ sha, fetchImpl })).code, EXIT.notEligible, JSON.stringify(overrides));
  }
});

test("refuses runs from pull requests, dispatch, master, forks, other repositories or other workflows", async () => {
  for (const overrides of [
    { event: "pull_request" }, { event: "workflow_dispatch" }, { head_branch: "master" },
    { head_repository: { full_name: "attacker/devkofi" } }, { repository: { full_name: "kofiarhin/escowear" } },
    { path: ".github/workflows/claude.yml" }, { head_sha: newer },
  ]) {
    const { fetchImpl } = github({ runById: run(overrides) });
    assert.equal((await checkRelease({ sha, runId: "100", fetchImpl })).code, EXIT.notEligible, JSON.stringify(overrides));
  }
});

test("lets the newest CI run decide when a commit has several", async () => {
  const { fetchImpl } = github({ runs: [run({ id: 100 }), run({ id: 101, conclusion: "failure" })] });
  assert.equal((await checkRelease({ sha, fetchImpl })).code, EXIT.notEligible);
});

test("refuses when no CI run exists for the commit", async () => {
  const { fetchImpl } = github({ runs: [] });
  assert.equal((await checkRelease({ sha, fetchImpl })).code, EXIT.notEligible);
});

test("refuses missing, duplicated or unsuccessful jobs even when the run succeeded", async () => {
  const ok = (name) => ({ name, status: "completed", conclusion: "success" });
  for (const list of [
    REQUIRED_JOBS.slice(1).map(ok),
    [...REQUIRED_JOBS.map(ok), ok(REQUIRED_JOBS[0])],
    REQUIRED_JOBS.map((name, i) => (i === 2 ? { name, status: "completed", conclusion: "skipped" } : ok(name))),
    [...REQUIRED_JOBS.map(ok), { name: "Extra job", status: "completed", conclusion: "failure" }],
  ]) {
    const { fetchImpl } = github({ jobList: jobs(list) });
    assert.equal((await checkRelease({ sha, fetchImpl })).code, EXIT.notEligible);
  }
});

test("fails closed on an incomplete job page", async () => {
  const { fetchImpl } = github({ jobList: { ...jobs(), total_count: 150 } });
  assert.equal((await checkRelease({ sha, fetchImpl })).code, EXIT.unavailable);
});

test("fails closed when GitHub is unreachable, rate-limited, erroring or returns junk", async () => {
  const cases = [
    async () => { throw new TypeError("fetch failed"); },
    async () => json({}, 403, { "x-ratelimit-remaining": "0" }),
    async () => json({}, 429, { "x-ratelimit-remaining": "0" }),
    async () => json({}, 502),
    async () => ({ status: 200, headers: new Headers(), json: async () => { throw new SyntaxError("bad"); } }),
    async () => json({ object: { sha: "not-a-sha" } }),
  ];
  for (const fetchImpl of cases) assert.equal((await checkRelease({ sha, fetchImpl })).code, EXIT.unavailable);
});

test("rejects malformed SHAs and run ids before calling GitHub", async () => {
  const fetchImpl = async () => { throw new Error("must not be called"); };
  for (const bad of ["", "abc", "A".repeat(40), `${sha}\n`, `${sha.slice(1)};`, undefined]) {
    assert.equal((await checkRelease({ sha: bad, fetchImpl })).code, EXIT.usage);
  }
  for (const runId of ["0", "1e3", "12;rm", "-1"]) assert.equal((await checkRelease({ sha, runId, fetchImpl })).code, EXIT.usage);
});

test("never puts a token in the request unless one is given", async () => {
  const seen = [];
  const { fetchImpl: inner } = github();
  const fetchImpl = (url, options) => { seen.push(options.headers.Authorization); return inner(url); };
  await checkRelease({ sha, fetchImpl });
  assert.ok(seen.every((value) => value === undefined));
});

test("required jobs match every job display name in ci.yml", () => {
  const jobsBlock = ciYaml.slice(ciYaml.indexOf("\njobs:"));
  const names = [...jobsBlock.matchAll(/^ {2}[A-Za-z0-9_-]+:\n {4}name: (.+)$/gm)].map((m) => m[1].trim());
  const jobIds = [...jobsBlock.matchAll(/^ {2}([A-Za-z0-9_-]+):$/gm)].map((m) => m[1]);
  assert.equal(names.length, jobIds.length, "every ci.yml job needs an explicit name");
  assert.deepEqual([...names].sort(), [...REQUIRED_JOBS].sort());
});

test("CLI rejects bad arguments with the usage exit code", () => {
  for (const args of [[], ["--sha"], ["--bogus", sha], ["--sha", sha, "--run-id"]]) {
    assert.equal(spawnSync(process.execPath, [script, ...args], { encoding: "utf8" }).status, EXIT.usage, args.join(" "));
  }
});
