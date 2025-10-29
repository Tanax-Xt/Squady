import fsd from "@feature-sliced/steiger-plugin";
import { defineConfig } from "steiger";

export default defineConfig([
  ...fsd.configs.recommended,
  {
    rules: {
      "fsd/excessive-slicing": "off",
      "fsd/insignificant-slice": "off",
      "fsd/no-segmentless-slices": "off",
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
