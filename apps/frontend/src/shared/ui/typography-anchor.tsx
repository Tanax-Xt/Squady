export function TypographyAnchor(props: React.ComponentProps<"a">) {
  return (
    <a
      href={`#${props.id}`}
      className="-top-2 leading-none no-underline opacity-0 transition-opacity outline-none group-hover:opacity-50 group-hover:hover:opacity-75 focus-visible:opacity-75 xl:absolute xl:-left-[2.125ch] xl:p-3"
      tabIndex={-1}
    >
      #
    </a>
  );
}
