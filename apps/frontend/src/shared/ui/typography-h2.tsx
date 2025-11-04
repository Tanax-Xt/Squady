import { TypographyAnchor } from "./typography-anchor";

export function TypographyH2({
  children,
  ...props
}: React.ComponentProps<"h2">) {
  return (
    <h2
      className="group relative mt-12 flex scroll-m-20 items-center gap-3 border-b pb-2 text-3xl font-semibold tracking-tight"
      {...props}
    >
      {children}
      <TypographyAnchor id={props.id} />
    </h2>
  );
}
