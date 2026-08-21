# Magyardle
A fun web-game that will test your knowledge of Hungarian regional geography (!)

## Prerequisites
Node.js (v16 or higher)
npm or yarn

## Setup
Clone the repository (if applicable)

### Install dependencies:
`npm install`
or
`yarn install`

## Development
Start the development server:

`npm run dev`
or
`yarn dev`

This launches the development server, usually available at http://localhost:5173.

## Build
Create a production build:

`npm run build`
or
`yarn build`

## Preview
Locally preview the production build:

`npm run preview`
or
`yarn preview`

This starts a local static server to test the production build, usually at http://localhost:4173.

## Testing
Run the unit test suite:

`npm test`
or
`npm run test:watch` for watch mode.

Generate a code coverage report:

`npm run test:coverage`

Tests are written with [Vitest](https://vitest.dev/) and [Testing Library](https://testing-library.com/).
Test files live alongside their source files using the `*.test.ts` / `*.test.tsx` naming convention.

### Coverage
The core data structures, algorithms, and hooks have full test coverage:
- `Graph`, `GraphNode`, `Trie`, `TrieNode` — data structure unit tests
- `floydWarshall` — all-pairs shortest path algorithm tests
- `declineRegions` (Hungarian declension) — vowel harmony and suffix tests
- `useGraph`, `useSearch` — React hook tests

## Linting & Formatting
Lint the codebase:

`npm run lint`
or
`npm run lint:fix` to auto-fix issues.

Check code formatting:

`npm run format:check`
or
`npm run format` to auto-format.

[ESLint](https://eslint.org/) with [typescript-eslint](https://typescript-eslint.io/) enforces code quality rules,
and [Prettier](https://prettier.io/) handles code formatting. The ESLint config integrates with Prettier
to avoid conflicting rules.
