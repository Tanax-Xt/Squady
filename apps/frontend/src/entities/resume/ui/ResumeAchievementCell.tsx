import { AwardIcon } from "lucide-react";

import Cell from "@/shared/ui/Cell";

import { ResumeAchievement } from "../model/schema/achievement";

type ResumeAchievementCellProps<T extends React.ElementType = "div"> =
  React.ComponentProps<typeof Cell<T>> & {
    achievement: ResumeAchievement;
  };

const ResumeAchievementCell = <T extends React.ElementType = "div">({
  achievement,
  ...props
}: ResumeAchievementCellProps<T>): React.ReactNode => {
  return (
    <Cell
      before={<AwardIcon />}
      label={achievement.title}
      detail={achievement.year}
      {...(props as React.ComponentProps<typeof Cell<T>>)}
    />
  );
};

export default ResumeAchievementCell;
