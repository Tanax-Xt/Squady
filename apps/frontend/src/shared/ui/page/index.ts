import Content, {
  type PageContentProps as ContentProps,
  type PageContentVariantProps as ContentVariantProps,
} from "./Content";
import contentVariants from "./Content.variants";
import Root, { type PageRootProps as RootProps } from "./Root";

export type { ContentProps, ContentVariantProps, RootProps };

export { Content, contentVariants, Root };

const Page = Object.assign(Root, {
  Content,
});

export default Page;
