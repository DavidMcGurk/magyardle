# Magyardle

🌐 **Play online at <https://davidmcgurk.github.io/magyardle/>**

A web game that tests your knowledge of Hungarian regional geography. Find the shortest path between two Hungarian regions on an interactive map.

## Prerequisites

- Node.js v16 or higher
- npm

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

The dev server runs at http://localhost:5173.

## Build

```bash
npm run build
```

## Preview

```bash
npm run preview
```

Serves the production build at http://localhost:4173.

## Testing

```bash
npm test              # run all tests
npm run test:watch    # watch mode
npm run test:coverage # with coverage report
```

Tests use [Vitest](https://vitest.dev/) and [Testing Library](https://testing-library.com/).
Test files sit alongside source files as `*.test.ts` / `*.test.tsx`.

### Coverage

Core data structures, algorithms, and hooks have full test coverage:

- `Graph`, `GraphNode`, `Trie`, `TrieNode` — data structure unit tests
- `floydWarshall` — all-pairs shortest path algorithm tests
- `declineRegions` — Hungarian declension (vowel harmony and suffix tests)
- `useGraph`, `useSearch` — React hook tests
- `i18n` — translation key parity and interpolation tests

## Linting & Formatting

```bash
npm run lint          # check for lint errors
npm run lint:fix      # auto-fix lint issues
npm run format:check  # check formatting
npm run format        # auto-format
```

[ESLint](https://eslint.org/) with [typescript-eslint](https://typescript-eslint.io/) enforces code quality rules.
[Prettier](https://prettier.io/) handles formatting. ESLint integrates with Prettier to avoid conflicts.

## Internationalization

The game supports Hungarian and English. A language toggle (HU / EN) in the header switches all UI text instantly.

Translations live in [`src/i18n.ts`](src/i18n.ts). The `t(language, key, value?)` helper retrieves strings,
with optional `{value}` interpolation for dynamic content. The Hungarian route prompt uses
[`declineRegions.ts`](src/dataStrucAlgs/declineRegions.ts) to apply proper Hungarian declension
(e.g., "Pestről Budára" — from Pest to Buda).

To add a new translatable string:

1. Add the key to both `english` and `hungarian` in `src/i18n.ts`
2. Use `t(language, "yourKey")` in any component
