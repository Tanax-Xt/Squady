import Link from "next/link";

import Button from "@/shared/ui/button";

interface LandingPageCtaProps {}

const LandingPageCta: React.FunctionComponent<LandingPageCtaProps> = () => {
  return (
    <section className="flex flex-col items-center justify-center gap-6 px-4 py-16">
      <hgroup className="space-y-4 text-center">
        <h1 className="text-4xl leading-none font-bold tracking-tighter text-balance">
          Готовы начать?
        </h1>
        <p className="text-lg leading-snug font-medium tracking-tight text-pretty text-muted-foreground">
          Присоединяйтесь к сообществу участников интеллектуальных соревнований
        </p>
      </hgroup>
      <Button asChild rounded="full">
        <Link href="/register">Создать аккаунт</Link>
      </Button>
    </section>
  );
};

export default LandingPageCta;
