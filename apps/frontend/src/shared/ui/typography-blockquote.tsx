export function TypographyBlockquote({
  children,
  ...props
}: React.ComponentProps<"blockquote">) {
  return (
    <blockquote className="mt-6 flex gap-6 text-muted-foreground" {...props}>
      <div className="h-auto w-1 flex-shrink-0 rounded-full bg-border" />
      <div className="flex-1">{children}</div>
    </blockquote>
  );
}
