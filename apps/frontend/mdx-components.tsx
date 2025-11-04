import type { MDXComponents } from "mdx/types";

import { components } from "@/shared/config/mdx";

export function useMDXComponents(): MDXComponents {
  return components;
}
