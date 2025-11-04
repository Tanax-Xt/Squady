import { MDXComponents } from "mdx/types";

import { TypographyA } from "../ui/typography-a";
import { TypographyBlockquote } from "../ui/typography-blockquote";
import { TypographyH1 } from "../ui/typography-h1";
import { TypographyH2 } from "../ui/typography-h2";
import { TypographyH3 } from "../ui/typography-h3";
import { TypographyH4 } from "../ui/typography-h4";
import { TypographyImg } from "../ui/typography-img";
import { TypographyInlineCode } from "../ui/typography-inline-code";
import { TypographyOL } from "../ui/typography-ol";
import { TypographyP } from "../ui/typography-p";
import { TypographySmall } from "../ui/typography-small";
import { TypographyUL } from "../ui/typography-ul";

export const components = {
  a: TypographyA,
  blockquote: TypographyBlockquote,
  h1: TypographyH1,
  h2: TypographyH2,
  h3: TypographyH3,
  h4: TypographyH4,
  img: TypographyImg,
  code: TypographyInlineCode,
  ol: TypographyOL,
  p: TypographyP,
  small: TypographySmall,
  ul: TypographyUL,
} satisfies MDXComponents;
