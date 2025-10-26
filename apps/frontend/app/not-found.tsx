import { ArrowLeftIcon, TrafficConeIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

import Placeholder from "@/shared/ui/Placeholder";
import Button from "@/shared/ui/button";

export const metadata: Metadata = {
  title: "Страница не найдена",
};

export default function NotFound() {
  return (
    <Placeholder
      before={<TrafficConeIcon />}
      title="Страница не найдена"
      description="Этой страницы не существует"
      after={
        <Button asChild size="lg">
          <Link href="/resume/profile/edit">
            <ArrowLeftIcon />
            <span>На главную</span>
          </Link>
        </Button>
      }
    />
  );
}
