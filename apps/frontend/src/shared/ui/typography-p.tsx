export function TypographyP(props: React.ComponentProps<"p">) {
  return <p className="leading-7 [&:not(:first-child)]:mt-6" {...props} />;
}
