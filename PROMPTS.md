# AI prompts used

This project (both `calculator-api` and `calculator-fe`) was built with Claude Code in
a single working session. The prompts below are the actual user prompts issued, in
order, with a short note on what each one produced. Clarifying questions Claude asked
back (stack choice, tool installs, Docker verification, etc.) are omitted here since
only user-authored prompts are being logged.

1. *"i need to create a new calculator app with a backend and frontend. what tools,
   mcps or skills do you recommend we install?"*
   → Scoped what tooling was actually needed (concluded: no new installs required for
   the JS/TS side; flagged Go as a knowledge gap).

2. Chose stack: **Go backend + React (TypeScript) frontend**.

3. *"please install the skills in the gstack repo"*
   → Searched `npx skills find gstack`, found `garrytan/gstack`, surfaced its actual
   scope (QA/browser-automation workflow suite, not Go-specific) and a security-scan
   flag (54 Socket alerts) before installing, per explicit confirmation.

4. Pasted the full assignment spec and asked: *"this is are the impleemntation specs
   before implementiing please make a markdown plan for developement it has to
   aachieve everything the task asks for"*
   → Produced `PLAN.md`: architecture, API contract, edge cases, test strategy,
   Docker plan, and milestones sized to the assignment's 2–4h budget.

5. *"do you think it might be necesarry to add a bff for the frontend?"*
   → Recommended against it (single backend, single client, no aggregation/auth need
   to justify the extra hop).

6. *"ok i am creating the repos give me a good brief description for the front"* and
   *"give me a description for the backend repo too"*
   → Short GitHub repo descriptions for both repos.

7. *"this is the location for both repos ... i will now read over the plan and give
   you the go ahead"*
   → No action; acknowledged and waited.

8. *"lets start with the backend"*
   → Scaffolded the Go module (`cmd/server`, `internal/calculator`, `internal/api`),
   implemented all operations with validation and edge-case handling, wrote
   table-driven and `httptest` unit tests, and manually smoke-tested the running
   server. (Go itself wasn't installed — installed via Homebrew mid-task at the
   user's instruction.)

9. *"add the README and Dockerfile for the backend, make sure the readme meets the
   criteria"*
   → Wrote the backend README (setup, run instructions, full curl API reference,
   testing/coverage instructions, design decisions) and a multi-stage Dockerfile;
   built and ran the image to confirm it actually works before calling it done.

10. *"give me the commit it msg and i'll do it myself"* → *"do not do liine jumps"*
    → Provided a single-line Conventional Commits message; the user committed it
    themselves.

11. *"let's start the frontend"*
    → Scaffolded Vite + React + TypeScript, built the `Calculator`/`Display`/`Keypad`
    components, an isolated `api/client.ts`, responsive CSS, and a Vitest + React
    Testing Library suite (14 tests, mocked-fetch API tests, user-event component
    tests). Verified with `tsc -b`, a production build, and a live smoke test against
    the running backend.

12. *"just checked it works perfectly! what else could we add that would have added
    value and alines with the task?"*
    → Identified remaining spec gaps: this frontend README, this `PROMPTS.md`, and
    the optional combined-deployment Docker setup.

13. *"yes, go ahead"*
    → Produced this file, the frontend README, and (next) the frontend Dockerfile
    plus a root-level `docker-compose.yml`.
