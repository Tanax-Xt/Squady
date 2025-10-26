import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";

import {
  UserAvatar,
  getCurrentUserPersonalData,
  getCurrentUserVerifiedParticipantOrMentor,
} from "@/entities/user";
import Cell from "@/shared/ui/Cell";
import Group from "@/shared/ui/Group";

const ResumePage: React.FunctionComponent = async () => {
  const [user, personal] = await Promise.all([
    getCurrentUserVerifiedParticipantOrMentor(),
    getCurrentUserPersonalData(),
  ]);

  const hasPersonalData = Object.values(personal).some(
    (value) => value !== null,
  );

  return (
    <>
      <h1 className="text-3xl font-semibold md:text-2xl">Мои резюме</h1>

      <Group>
        <Cell
          as={Link}
          href={hasPersonalData ? "/resume/profile" : "/resume/profile/edit"}
          className={["bg-sidebar-accent", "text-sidebar-accent-foreground"]}
          before={<UserAvatar user={user} className="size-10" />}
          label={
            personal.full_name?.split(" ").slice(0, 2).join(" ") ??
            user.username
          }
          description={
            hasPersonalData ? "Мои личные данные" : "Заполнить личные данные"
          }
          after={<ChevronRightIcon />}
          hoverable
        />
      </Group>
    </>
  );
};

export default ResumePage;
