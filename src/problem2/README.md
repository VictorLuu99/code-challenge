# Problem 2 - Currency Swap Form

A small currency-swap form built with React, TypeScript, Vite, and
Tailwind CSS. Token list and prices come from the provided endpoint.
Swap submission is mocked with a 1.5s loading state.

Live demo: https://99tech-currency-swap.pages.dev

## Run

```
npm install
npm run dev
```

Open the URL printed by Vite.

## Build

```
npm run build
npm run preview
```

## What it does

- Fetches `https://interview.switcheo.com/prices.json` once on mount.
  Tokens without a price are filtered out. Multiple entries for the
  same currency are reduced to the most recent.
- Two token-amount rows with a swap-direction button between them.
  Selecting a token opens a searchable modal.
- Live exchange rate displayed below the rows.
- Validation for empty amount, non-positive amount, missing tokens,
  or same token on both sides; the submit button shows the active
  validation message.
- "Confirm Swap" simulates a backend round-trip (1.5s) and shows a
  result toast.

## Stack

- React 19
- TypeScript 5
- Vite 6
- Tailwind CSS 4 (via `@tailwindcss/vite`)

Token icons are loaded from
`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/<SYMBOL>.svg`.
Symbols without a corresponding icon fall back gracefully (image is
hidden, symbol text remains visible).

## Notes / assumptions

- The "swap" itself is mocked - there's no wallet integration, no
  balance check.
- The price endpoint sometimes contains multiple entries per token;
  we keep the latest by `date`.
- Layout uses a single dark theme for visual focus; no theme toggle.
