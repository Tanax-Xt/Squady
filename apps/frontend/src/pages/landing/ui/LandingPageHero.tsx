import {
  ArrowRightIcon,
  BlocksIcon,
  MessagesSquareIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/shared/ui/button";

interface LandingPageHeroProps {}

const LandingPageHero: React.FunctionComponent<LandingPageHeroProps> = () => {
  return (
    <section className="relative z-10 flex h-full flex-col items-center justify-center px-4 py-16">
      <hgroup className="space-y-4 text-center text-balance">
        <h1 className="text-5xl leading-none font-bold tracking-tighter md:text-6xl lg:text-7xl">
          Найди свою команду для{" "}
          <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-sky-500 bg-clip-text text-transparent">
            олимпиад
          </span>{" "}
          и{" "}
          <span className="bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            хакатонов
          </span>
        </h1>
        <p className="text-xl leading-snug font-medium tracking-tight text-muted-foreground">
          Платформа для формирования{" "}
          <span className="inline-flex items-center gap-1 leading-none font-semibold text-accent-foreground">
            <MessagesSquareIcon className="size-3.5 stroke-current stroke-3 align-top" />
            <span>команд</span>
          </span>
          , поиска{" "}
          <span className="inline-flex items-center gap-1 leading-none font-semibold text-accent-foreground">
            <UsersIcon className="size-3.5 stroke-current stroke-3 align-top" />
            <span>участников</span>
          </span>{" "}
          и управления{" "}
          <span className="inline-flex items-center gap-1 leading-none font-semibold text-accent-foreground">
            <BlocksIcon className="size-3.5 stroke-current stroke-3 align-top" />
            <span>проектами</span>
          </span>{" "}
          в интеллектуальных соревнованиях
        </p>
      </hgroup>

      <div className="mt-8 flex w-full flex-wrap items-center justify-center gap-2">
        <Button asChild>
          <Link href="/register">Найти команду</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/register">
            <span>Посмотреть события</span>
            <ArrowRightIcon />
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default LandingPageHero;
