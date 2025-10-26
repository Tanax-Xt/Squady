import Image from "next/image";

interface LandingPageHeaderProps {}

const LandingPageHeader: React.FunctionComponent<
  LandingPageHeaderProps
> = () => {
  return (
    <header className="mt-4 flex items-center justify-center gap-2 md:mt-6">
      <Image
        src="/icon.svg"
        alt="Логотип"
        width={32}
        height={32}
        decoding="async"
        draggable={false}
        fetchPriority="high"
      />
      <span className="text-lg font-semibold">Squady</span>
    </header>
  );
};

export default LandingPageHeader;
