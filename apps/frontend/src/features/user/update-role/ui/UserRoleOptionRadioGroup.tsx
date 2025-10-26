"use client";

import { RadioGroup } from "@radix-ui/react-radio-group";
import { GraduationCapIcon, TrophyIcon, UsersIcon } from "lucide-react";

import UserRoleOptionRadioGroupItem from "./UserRoleOptionRadioGroupItem";
import { UserRoleOption } from "../model/types";

export const UserParticipantRoleOption = {
  icon: UsersIcon,
  iconWrapperClassName: "bg-blue-600 text-neutral-50 ring-blue-500",
  color: "blue",
  label: "Участник",
  description: "Ищу команду для участия в олимпиадах и хакатонах",
  value: "participant",
} as const satisfies UserRoleOption;

export const UserMentorRoleOption = {
  icon: GraduationCapIcon,
  iconWrapperClassName: "bg-green-600 text-neutral-50 ring-green-500",
  color: "green",
  label: "Наставник",
  description: "Помогаю командам и делюсь опытом",
  value: "mentor",
} as const satisfies UserRoleOption;

export const UserAgentRoleOption = {
  icon: TrophyIcon,
  iconWrapperClassName: "bg-yellow-600 text-neutral-50 ring-yellow-500",
  color: "yellow",
  label: "Представитель олимпиады",
  description: "Организую мероприятия и управляю соревнованиями",
  value: "agent",
} as const satisfies UserRoleOption;

export const ROLE_OPTIONS: UserRoleOption[] = [
  UserParticipantRoleOption,
  UserMentorRoleOption,
  UserAgentRoleOption,
] as const;

interface UserRoleOptionRadioGroupProps
  extends Omit<React.ComponentProps<typeof RadioGroup>, "children"> {
  options: UserRoleOption[];
}

const UserRoleOptionRadioGroup: React.FunctionComponent<
  UserRoleOptionRadioGroupProps
> = ({ options, ...otherProps }) => {
  return (
    <RadioGroup {...otherProps}>
      {options.map((option) => (
        <UserRoleOptionRadioGroupItem key={option.value} option={option} />
      ))}
    </RadioGroup>
  );
};

export default UserRoleOptionRadioGroup;
