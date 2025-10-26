"use client";

import Image from "next/image";

import ThemeRadioGroup from "@/shared/ui/ThemeRadioGroup";

interface LandingPageFooterProps {}

const LandingPageFooter: React.FunctionComponent<
  LandingPageFooterProps
> = () => {
  return (
    <footer className="flex items-center justify-between px-4 py-16">
      <div className="flex items-center gap-2">
        <Image
          src="/icon.svg"
          alt="Логотип"
          width={24}
          height={24}
          loading="lazy"
          decoding="async"
          draggable={false}
          fetchPriority="low"
        />
        <span className="text-base font-semibold">Squady</span>
      </div>
      <ThemeRadioGroup />
    </footer>
  );
};

export default LandingPageFooter;
