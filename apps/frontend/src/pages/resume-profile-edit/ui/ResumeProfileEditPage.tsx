import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

import { getCurrentUserVerifiedParticipantOrMentor } from "@/entities/user";
import { ResumeProfileForm } from "@/features/user/update-personal";
import { Button } from "@/shared/ui/button";

import { getDefaultValues } from "../lib/getDefaultValues";

const ResumeProfileEditPage: React.FunctionComponent = async () => {
  const user = await getCurrentUserVerifiedParticipantOrMentor();

  const defaultValues = getDefaultValues({ ...user });

  return (
    <main className="m-auto flex size-full min-h-dvh max-w-xl flex-col items-start justify-center gap-6 px-4 py-6">
      <Button
        size="sm"
        variant={defaultValues.full_name ? "link" : "secondary"}
        asChild
      >
        <Link href={defaultValues.full_name ? "/resumes/profile" : "/home"}>
          <ArrowLeftIcon />
          {defaultValues.full_name ? "Назад" : "Заполнить позже"}
        </Link>
      </Button>
      <hgroup className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">
          {defaultValues.full_name
            ? "Изменение личных данных"
            : "Заполнение личных данных"}
        </h1>
        <p className="text-pretty text-muted-foreground">
          Личные данные общие для всех созданных вами резюме и видны в каждом из
          них.
        </p>
      </hgroup>
      <ResumeProfileForm defaultValues={defaultValues} />
    </main>
  );
};

export default ResumeProfileEditPage;
