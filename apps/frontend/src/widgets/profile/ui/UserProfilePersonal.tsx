import {
  UserAboutCell,
  UserBirthDateCell,
  UserCityCell,
  UserFullNameCell,
  UserTelegramCell,
} from "@/entities/user";
import { CurrentUserPersonalDataResponse } from "@/shared/api";
import { cn } from "@/shared/lib/utils";
import Group from "@/shared/ui/Group";

export interface UserProfilePersonalProps
  extends React.ComponentProps<"section"> {
  personal: CurrentUserPersonalDataResponse;
}

const UserProfilePersonal: React.FunctionComponent<
  UserProfilePersonalProps
> = ({ personal, className, ...otherProps }) => {
  const cells = [
    {
      cell: UserFullNameCell,
      value: personal.full_name,
    },
    {
      cell: UserBirthDateCell,
      value: personal.birth_date,
    },
    {
      cell: UserCityCell,
      value: personal.city,
    },
    {
      cell: UserTelegramCell,
      value: personal.telegram,
    },
    {
      cell: UserAboutCell,
      value: personal.about,
    },
  ];

  return (
    <section className={cn("flex flex-col gap-4", className)} {...otherProps}>
      {cells.map(
        (cell, index) =>
          cell.value && (
            <Group key={index}>
              <cell.cell value={cell.value} />
            </Group>
          ),
      )}
    </section>
  );
};

export default UserProfilePersonal;
