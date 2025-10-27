import { ChevronRightIcon, FileUserIcon, PlusIcon } from "lucide-react";
import Link from "next/link";

import { compareResumeResponses, ResumeCard } from "@/entities/resume";
import {
  getCurrentUserResumes,
  getCurrentUserVerifiedParticipantOrMentor,
  UserAvatar,
} from "@/entities/user";
import { ResumeCardUserActions } from "@/features/resume/edit";
import Button from "@/shared/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/shared/ui/empty";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/shared/ui/item";
import { UserProfilePersonalEmpty } from "@/widgets/profile";

const ResumePage: React.FunctionComponent = async () => {
  const user = await getCurrentUserVerifiedParticipantOrMentor();
  const resumes = await getCurrentUserResumes();

  return (
    <>
      <h1 className="text-2xl font-semibold">Мои резюме</h1>

      <Item size="sm" variant="muted" className="border border-border" asChild>
        <Link href="/resume/profile">
          <ItemMedia variant="image">
            <UserAvatar user={user} className="size-full text-lg" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>
              {user.full_name?.split(" ").slice(0, 2).join(" ") ??
                user.username}
            </ItemTitle>
            <ItemDescription>
              {user.full_name ? "Мои личные данные" : "Нет личных данных"}
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <ChevronRightIcon className="size-4" />
          </ItemActions>
        </Link>
      </Item>

      {!!user.full_name ? (
        <>
          {!!resumes?.resumes.length ? (
            <div className="mt-2 space-y-4">
              {resumes?.resumes.sort(compareResumeResponses).map((resume) => (
                <ResumeCard
                  key={resume.id}
                  resume={resume}
                  actions={<ResumeCardUserActions resume={resume} />}
                />
              ))}
            </div>
          ) : (
            <Empty>
              <EmptyMedia variant="icon">
                <FileUserIcon />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>Нет резюме</EmptyTitle>
                <EmptyDescription>
                  Вы ещё не содавали ни одного резюме.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button size="sm" asChild>
                  <Link href="/resume/create">
                    <PlusIcon />
                    Создать первое резюме
                  </Link>
                </Button>
              </EmptyContent>
            </Empty>
          )}
        </>
      ) : (
        <UserProfilePersonalEmpty />
      )}
    </>
  );
};

export default ResumePage;
