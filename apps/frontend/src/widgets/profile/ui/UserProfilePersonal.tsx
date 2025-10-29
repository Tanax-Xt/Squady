import {
  UserAboutCell,
  UserBirthDateCell,
  UserCityCell,
  UserFullNameCell,
  UserTelegramCell,
} from "@/entities/user";
import { ResumeResponse } from "@/shared/api";
import { cn } from "@/shared/lib/utils";
import Group from "@/shared/ui/Group";

export interface UserProfilePersonalProps
  extends React.ComponentProps<"section"> {
  user: ResumeResponse["personal_data"];
}

const UserProfilePersonal: React.FunctionComponent<
  UserProfilePersonalProps
> = ({ user, className, ...otherProps }) => {
  const cells = [
    {
      cell: UserFullNameCell,
      value: user.full_name,
    },
    {
      cell: UserBirthDateCell,
      value: user.birth_date,
    },
    {
      cell: UserCityCell,
      value: user.city,
    },
    {
      cell: UserTelegramCell,
      value: user.telegram,
    },
    {
      cell: UserAboutCell,
      value: user.about,
    },
  ];

  return (
    <section className={cn("flex flex-col gap-4", className)} {...otherProps}>
      {cells.map(
        (cell, index) =>
          !!cell.value && (
            <Group key={index}>
              <cell.cell value={cell.value} />
            </Group>
          ),
      )}
    </section>
  );
};

export default UserProfilePersonal;
