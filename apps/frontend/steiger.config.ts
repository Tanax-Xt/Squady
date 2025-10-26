import fsd from "@feature-sliced/steiger-plugin";
import { defineConfig } from "steiger";

export default defineConfig([
  ...fsd.configs.recommended,
  {
    rules: {
      "fsd/insignificant-slice": "off",
    },
  },
  {
    files: ["./src/shared/**"],
    rules: {
      "fsd/no-public-api-sidestep": "off",
      "fsd/public-api": "off",
      "fsd/segments-by-purpose": "off",
    },
  },
]);
