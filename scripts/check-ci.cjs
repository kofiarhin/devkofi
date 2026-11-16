#!/usr/bin/env node
"use strict";
// Release eligibility gate shared by .github/workflows/deploy.yml and scripts/deploy.sh.
// A commit may be released only if it is the current tip of main and the CI
// workflow's push run for that exact commit passed every required job.
// Uses the public GitHub API without a token on Beast (the repository is public);
// any GitHub error or rate limit fails closed. Never prints response bodies.

const REPO = "kofiarhin/devkofi";
const BRANCH = "main";
const CI_WORKFLOW_PATH = ".github/workflows/ci.yml";
// Display names of every job in ci.yml. scripts/tests/check-ci.test.mjs fails if
// ci.yml gains, loses or renames a job without this list being updated.
const REQUIRED_JOBS = ["Validate backend", "Validate deployment scripts", "Verify frontend Docker build"];
const EXIT = { eligible: 0, usage: 64, notEligible: 65, unavailable: 69, stale: 75 };
const SHA_PATTERN = /^[0-9a-f]{40}$/;
const RUN_ID_PATTERN = /^[1-9][0-9]{0,19}$/;
const TIMEOUT_MS = 15_000;

class GateError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

const createApi = ({ fetchImpl, token }) => async (path) => {
  const headers = { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", "User-Agent": "devkofi-release-gate" };
  if (token) headers.Authorization = `Bearer ${token}`;
  let response;
  try {
    response = await fetchImpl(`https://api.github.com${path}`, { headers, signal: AbortSignal.timeout(TIMEOUT_MS) });
  } catch {
    throw new GateError(EXIT.unavailable, "GitHub API unreachable");
  }
  if ((response.status === 403 || response.status === 429) && response.headers.get("x-ratelimit-remaining") === "0") {
    throw new GateError(EXIT.unavailable, "GitHub API rate limit reached; retry later");
  }
  if (response.status !== 200) throw new GateError(EXIT.unavailable, `GitHub API returned HTTP ${response.status}`);
  try {
    return await response.json();
  } catch {
    throw new GateError(EXIT.unavailable, "GitHub API returned invalid JSON");
  }
};

const requireCurrentMain = async (api, sha) => {
  const ref = await api(`/repos/${REPO}/git/ref/heads/${BRANCH}`);
  const tip = ref?.object?.sha;
  if (typeof tip !== "string" || !SHA_PATTERN.test(tip)) throw new GateError(EXIT.unavailable, "GitHub returned no valid main SHA");
  if (tip !== sha) throw new GateError(EXIT.stale, `${sha.slice(0, 12)} is not the current main (${tip.slice(0, 12)}); stale release refused`);
};

const findRun = async (api, sha, runId) => {
  if (runId) return api(`/repos/${REPO}/actions/runs/${runId}`);
  const query = new URLSearchParams({ branch: BRANCH, event: "push", head_sha: sha, per_page: "20" });
  const list = await api(`/repos/${REPO}/actions/workflows/ci.yml/runs?${query}`);
  const runs = Array.isArray(list?.workflow_runs) ? list.workflow_runs : [];
  if (!runs.length) throw new GateError(EXIT.notEligible, `no CI push run found for ${sha.slice(0, 12)}`);
  // The newest run decides; an older green run cannot outvote a newer red one.
  return runs.reduce((newest, run) => (run.id > newest.id ? run : newest));
};

const requireSuccessfulRun = (run, sha) => {
  const checks = [
    [run?.repository?.full_name === REPO, "CI run belongs to another repository"],
    [run?.head_repository?.full_name === REPO, "CI run was built from a fork"],
    [run?.path === CI_WORKFLOW_PATH, "run is not the CI workflow"],
    [run?.event === "push", `CI run event is ${run?.event}, not push`],
    [run?.head_branch === BRANCH, `CI run branch is ${run?.head_branch}, not ${BRANCH}`],
    [run?.head_sha === sha, "CI run is for a different commit"],
    [run?.status === "completed", `CI run is ${run?.status}`],
    [run?.conclusion === "success", `CI run concluded ${run?.conclusion}`],
  ];
  const failed = checks.find(([ok]) => !ok);
  if (failed) throw new GateError(EXIT.notEligible, failed[1]);
};

const requireJobs = async (api, run) => {
  const data = await api(`/repos/${REPO}/actions/runs/${run.id}/jobs?filter=latest&per_page=100`);
  const jobs = Array.isArray(data?.jobs) ? data.jobs : null;
  if (!jobs || data.total_count !== jobs.length) throw new GateError(EXIT.unavailable, "GitHub returned an incomplete job list");
  for (const name of REQUIRED_JOBS) {
    const matches = jobs.filter((job) => job.name === name);
    if (matches.length !== 1) throw new GateError(EXIT.notEligible, `required job "${name}" ${matches.length ? "is ambiguous" : "is missing"}`);
  }
  const unsuccessful = jobs.find((job) => job.status !== "completed" || job.conclusion !== "success");
  if (unsuccessful) throw new GateError(EXIT.notEligible, `job "${unsuccessful.name}" concluded ${unsuccessful.conclusion || unsuccessful.status}`);
};

const checkRelease = async ({ sha, runId, fetchImpl = fetch, token } = {}) => {
  try {
    if (typeof sha !== "string" || !SHA_PATTERN.test(sha)) throw new GateError(EXIT.usage, "expected a full 40-character lowercase commit SHA");
    if (runId !== undefined && !RUN_ID_PATTERN.test(String(runId))) throw new GateError(EXIT.usage, "invalid CI run id");
    const api = createApi({ fetchImpl, token });
    await requireCurrentMain(api, sha);
    const run = await findRun(api, sha, runId);
    requireSuccessfulRun(run, sha);
    await requireJobs(api, run);
    return { code: EXIT.eligible, message: `${sha.slice(0, 12)} passed CI run ${run.id} and is the current main` };
  } catch (error) {
    if (error instanceof GateError) return { code: error.code, message: error.message };
    return { code: EXIT.unavailable, message: "unexpected release-gate error" };
  }
};

const parseArgs = (argv) => {
  const args = {};
  for (let i = 0; i < argv.length; i += 2) {
    const [flag, value] = [argv[i], argv[i + 1]];
    if (flag === "--sha" && value !== undefined) args.sha = value;
    else if (flag === "--run-id" && value !== undefined) args.runId = value;
    else return null;
  }
  return args.sha ? args : null;
};

const main = async () => {
  const args = parseArgs(process.argv.slice(2));
  if (!args) {
    console.error("[ci-gate] usage: check-ci.cjs --sha <40-hex> [--run-id <id>]");
    return EXIT.usage;
  }
  // Only GitHub Actions supplies a token (its own read-only one); Beast stays anonymous.
  const token = process.env.GITHUB_ACTIONS === "true" ? process.env.GITHUB_TOKEN : undefined;
  const { code, message } = await checkRelease({ ...args, token });
  (code === EXIT.eligible ? console.log : console.error)(`[ci-gate] ${code === EXIT.eligible ? "PASSED" : "REFUSED"}: ${message}`);
  return code;
};

module.exports = { checkRelease, EXIT, REQUIRED_JOBS, REPO };

if (require.main === module) main().then((code) => { process.exitCode = code; });
