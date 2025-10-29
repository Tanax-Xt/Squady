import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";

import { ResumesMyEmpty } from "@/entities/resume";
import {
  getCurrentUserResumes,
  getCurrentUserVerifiedParticipantOrMentor,
  UserAvatar,
} from "@/entities/user";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/shared/ui/item";
import { UserProfilePersonalEmpty } from "@/widgets/profile";
import { ResumeList } from "@/widgets/resume-list";

const ResumePage: React.FunctionComponent = async () => {
  const user = await getCurrentUserVerifiedParticipantOrMentor();
  const resumes = await getCurrentUserResumes();

  return (
    <>
      <h1 className="text-2xl font-semibold">Мои резюме</h1>

      <Item size="sm" variant="muted" className="border border-border" asChild>
        <Link href="/resumes/profile">
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
        !!resumes?.resumes.length ? (
          <ResumeList resumes={resumes.resumes} />
        ) : (
          <ResumesMyEmpty />
        )
      ) : (
        <UserProfilePersonalEmpty />
      )}
    </>
  );
};

export default ResumePage;
