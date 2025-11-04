import { TypographyAnchor } from "./typography-anchor";

export function TypographyH3({
  children,
  ...props
}: React.ComponentProps<"h3">) {
  return (
    <h3
      className="group relative mt-10 flex scroll-m-20 items-center gap-3 text-2xl font-semibold tracking-tight"
      {...props}
    >
      {children}
      <TypographyAnchor id={props.id} />
    </h3>
  );
}
