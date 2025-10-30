import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

import { getCurrentUserVerifiedParticipantOrMentor } from "@/entities/user";
import { ResumeProfileForm } from "@/features/user/update-personal";
import Bar from "@/shared/ui/bar";
import { Button } from "@/shared/ui/button";
import Page from "@/shared/ui/page";

import { getDefaultValues } from "../lib/getDefaultValues";

const ResumeProfileEditPage: React.FunctionComponent = async () => {
  const user = await getCurrentUserVerifiedParticipantOrMentor();

  const defaultValues = getDefaultValues({ ...user });

  return (
    <Page>
      <Bar>
        <Bar.Start>
          <Button variant="ghost" asChild>
            <Link href={defaultValues.full_name ? "/resumes/profile" : "/home"}>
              <ArrowLeftIcon />
              {defaultValues.full_name ? "Назад" : "Позже"}
            </Link>
          </Button>
        </Bar.Start>
        <Bar.Center showAfterScrolled>Личные данные</Bar.Center>
      </Bar>
      <Page.Content size="xl">
        <hgroup className="mb-6 space-y-3">
          <h1 className="text-2xl font-semibold tracking-tight">
            {defaultValues.full_name
              ? "Изменение личных данных"
              : "Заполнение личных данных"}
          </h1>
          <p className="text-pretty text-muted-foreground">
            Личные данные общие для всех созданных вами резюме и видны в каждом
            из них.
          </p>
        </hgroup>
        <ResumeProfileForm defaultValues={defaultValues} />
      </Page.Content>
    </Page>
  );
};

export default ResumeProfileEditPage;
