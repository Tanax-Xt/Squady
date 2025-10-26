import { cva } from "class-variance-authority";

const pageContentVariants = cva(
  "flex w-full grow flex-col items-stretch gap-4 p-4",
  {
    variants: {
      size: {
        "3xs": "md:max-w-3xs",
        "2xs": "md:max-w-2xs",
        xs: "md:max-w-xs",
        sm: "md:max-w-sm",
        md: "md:max-w-md",
        lg: "md:max-w-lg",
        xl: "md:max-w-xl",
        "2xl": "md:max-w-2xl",
        "3xl": "md:max-w-3xl",
        "4xl": "md:max-w-4xl",
        "5xl": "md:max-w-5xl",
        "6xl": "md:max-w-6xl",
        "7xl": "md:max-w-7xl",
        full: "",
      },
    },
    defaultVariants: {
      size: "full",
    },
  },
);

export default pageContentVariants;
