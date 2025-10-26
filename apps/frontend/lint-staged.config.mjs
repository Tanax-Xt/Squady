export default {
  "*.{js,jsx,ts,tsx}": () => [
    "pnpm lint:tsc",
    "pnpm lint:steiger",
    "pnpm lint:next",
  ],
  "*.{js,jsx,ts,tsx,css,scss,less,html,json,md}": [
    "pnpm format:prettier:write",
  ],
  "package.json": ["pnpm format:package"],
};
