import {
  ChartColumnIcon,
  LightbulbIcon,
  SearchIcon,
  TrophyIcon,
  UsersIcon,
} from "lucide-react";

import { BentoCard, BentoGrid } from "@/shared/ui/bento-grid";
import FlickeringGrid from "@/shared/ui/flickering-grid";

import LandingPageTeamAnimatedBeam from "./LandingPageTeamAnimatedBeam";

const features = [
  {
    Icon: TrophyIcon,
    name: "База событий",
    description: "Актуальная информация об олимпиадах, хакатонах и конкурсах",
    href: "/register",
    cta: "Посмотреть события",
    background: (
      <FlickeringGrid
        className="absolute top-2 left-2 w-full [mask-image:radial-gradient(192px_circle_at_center,white,transparent)]"
        color="oklch(62.7% 0.194 149.214)"
        squareSize={10}
        gridGap={4}
        maxOpacity={0.375}
        flickerChance={0.1}
      />
    ),
    className:
      "md:col-start-1 md:col-end-3 md:row-start-1 md:row-end-1 lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: SearchIcon,
    name: "Умный поиск",
    description:
      "Находите участников по навыкам, опыту и интересам с помощью фильтров",
    background: "",
    className:
      "md:col-start-3 md:col-end-3 md:row-start-1 md:row-end-1 lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: UsersIcon,
    name: "Формирование команд",
    description:
      "Создавайте команды, приглашайте участников и управляйте составом",
    href: "/register",
    cta: "Найти команду",
    background: (
      <LandingPageTeamAnimatedBeam className="absolute top-4 right-2 h-96 border-none [mask-image:linear-gradient(to_top,transparent_5%,#000_75%)] transition-transform duration-300 ease-out group-hover:scale-105 max-lg:-top-1/4" />
    ),
    className:
      "lg:row-start-1 lg:row-end-4 lg:col-start-2 max-lg:h-80 lg:col-end-3",
  },
  {
    Icon: LightbulbIcon,
    name: "Рекомендации",
    description: "Персональные предложения событий на основе вашего профиля",
    background: "",
    className:
      "md:col-start-1 md:col-end-1 md:row-start-3 md:row-end-3 lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: ChartColumnIcon,
    name: "Аналитика",
    description: "Статистика по заявкам, активности команд и результатам",
    background: (
      <FlickeringGrid
        className="absolute top-2 left-2 w-full [mask-image:radial-gradient(192px_circle_at_center,white,transparent)]"
        color="oklch(62.7% 0.194 149.214)"
        squareSize={10}
        gridGap={4}
        maxOpacity={0.375}
        flickerChance={0.1}
      />
    ),
    href: "/register",
    cta: "Зарегистрировать организацию",
    className:
      "md:col-start-2 md:col-end-4 md:row-start-3 md:row-end-3 lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
  },
];

interface LandingPageFeaturesProps {}

const LandingPageFeatures: React.FunctionComponent<
  LandingPageFeaturesProps
> = () => {
  return (
    <section className="px-4 py-16">
      <h2 className="mb-8 text-center text-4xl leading-none font-bold tracking-tighter">
        Возможности платформы
      </h2>
      <BentoGrid className="grid lg:grid-rows-3">
        {features.map((feature) => (
          <BentoCard key={feature.name} {...feature} />
        ))}
      </BentoGrid>
    </section>
  );
};

export default LandingPageFeatures;
