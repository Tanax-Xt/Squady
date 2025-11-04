import Image from "next/image";

export function TypographyImg(props: React.ComponentProps<typeof Image>) {
  return (
    <Image
      className="size-full rounded border"
      width={1280}
      height={1280}
      quality={100}
      {...props}
    />
  );
}
