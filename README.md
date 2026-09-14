# calculator-fe

A React + TypeScript calculator UI that consumes the
[calculator-api](https://github.com/DvillamizarM/danielavillamizar-calculator-api) Go backend for
all arithmetic. Built with Vite.

## Contents

- [Setup](#setup)
- [Running the app](#running-the-app)
- [API usage](#api-usage)
- [Testing](#testing)
- [Project structure](#project-structure)
- [Design decisions & assumptions](#design-decisions--assumptions)

## Setup

**Requirements:** Node.js 20+ and npm.

```bash
git clone https://github.com/DvillamizarM/danielavillamizar-calculator-fe.git
cd danielavillamizar-calculator-fe
npm install
```

## Running the app

The app needs the [calculator-api](https://github.com/DvillamizarM/danielavillamizar-calculator-api)
backend running first (default: `http://localhost:8080`).

```bash
# in danielavillamizar-calculator-api
go run ./cmd/server

# in danielavillamizar-calculator-fe
npm run dev
```

Then open the URL Vite prints (default `http://localhost:5173`).

**Pointing at a different backend URL:** set `VITE_API_BASE_URL` (e.g. in a `.env.local`
file) — it defaults to `http://localhost:8080` if unset.

```bash
echo "VITE_API_BASE_URL=http://localhost:9000" > .env.local
```

**Production build:**

```bash
npm run build     # type-checks and outputs static files to dist/
npm run preview   # serve the production build locally
```

**With Docker:** see the [Dockerfile](./Dockerfile) in this repo, or the
`docker-compose.yml` in `danielavillamizar-calculator-api` to run both services
together (see that repo's README for details — it assumes both repos are cloned as
sibling directories).

## API usage

The frontend calls a single endpoint on the backend — `POST /api/v1/calculate` — via
`src/api/client.ts`, which isolates all `fetch` calls so components never touch the
network directly.

```ts
import { calculate } from './api/client'

const result = await calculate('add', 2, 3)       // -> 5
const root = await calculate('sqrt', 16)           // -> 4  ("b" omitted for unary ops)
```

On a `4xx`/`5xx` response or a network failure, `calculate` throws an `ApiError` whose
`message` is safe to display directly to the user (it's either the backend's own error
message, e.g. `"division by zero"`, or a client-side fallback like *"Could not reach the
calculator server. Is it running?"*).

See the [calculator-api README](https://github.com/DvillamizarM/danielavillamizar-calculator-api#api-reference)
for the full request/response contract and curl examples.

## Testing

```bash
npm test               # run all tests once
npm run test:watch     # watch mode
npm run test:coverage  # run with a coverage report
```

Stack: [Vitest](https://vitest.dev) + [React Testing Library](https://testing-library.com/react).

- `src/api/client.test.ts` — mocks `fetch` to test the success path, the "b omitted for
  unary ops" request shape, server error messages, generic HTTP failures, network
  failures, and malformed response bodies.
- `src/components/Calculator.test.tsx` — renders the real component tree and drives it
  via user-event: a full calculate flow, client-side validation (missing values,
  divide-by-zero, negative sqrt) that never calls the API, the unary-operation UI
  (second input hidden for sqrt), server-side error surfacing, and Clear.

Current coverage: 100% lines / ~98% statements across `src/api` and `src/components`.

## Project structure

```
src/
├── api/client.ts            fetch wrapper + response typing/validation — the only
│                             place that talks to the backend
├── components/
│   ├── Calculator.tsx        state, validation, and orchestration
│   ├── Display.tsx           shows the result or an error message
│   └── Keypad.tsx             operation selector + operand inputs + actions
├── types.ts                  shared types + the operation list (label/symbol/unary)
└── App.tsx
```

## Design decisions & assumptions

- **Client-side validation mirrors, but doesn't replace, server-side validation.**
  Empty/non-numeric input, divide-by-zero, and negative-sqrt are caught immediately in
  the UI for fast feedback — but any error the backend returns is still surfaced
  as-is, since the frontend can't assume it caught every case (e.g. overflow).
- **A form with two operand inputs and an operation selector**, not a traditional
  calculator keypad (digit buttons). This maps cleanly onto the backend's
  `{operation, a, b}` contract and is simpler to build and test correctly within the
  time budget; a digit-entry keypad would add UI complexity without exercising more of
  the backend contract.
- **No state management library.** All state is local to `Calculator` via `useState`
  — there's a single view and no cross-component or server-cache state to justify one.
- **`api/client.ts` is the single seam to the backend.** Components never call `fetch`
  directly, so the network layer is swappable and mockable in tests without touching
  component code.
- **Numbers are native JS `number`**, matching the backend's `float64` — no
  arbitrary-precision requirement stated in the spec.
- **No calculation history or persistence** — nothing in the spec asks for it, and it
  would be state without a clear requirement behind it.
