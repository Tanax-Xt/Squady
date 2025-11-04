import { TypographyAnchor } from "./typography-anchor";

export function TypographyH4({
  children,
  ...props
}: React.ComponentProps<"h4">) {
  return (
    <h4
      className="group relative mt-8 scroll-m-16 items-center gap-3 text-xl font-semibold tracking-tight"
      {...props}
    >
      {children}
      <TypographyAnchor id={props.id} />
    </h4>
  );
}
