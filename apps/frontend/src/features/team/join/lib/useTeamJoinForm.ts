import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";

import { CurrentUserResponse, TeamResponse } from "@/shared/api";

import { joinTeam } from "../api/actions";
import {
  teamJoinFormSchema,
  TeamJoinFormSchemaValues,
} from "../model/teamJoinFormSchema";

export const useTeamJoinForm = ({
  team,
  user,
}: {
  team: TeamResponse;
  user: CurrentUserResponse;
}) => {
  const form = useForm<TeamJoinFormSchemaValues>({
    mode: "onChange",
    resolver: zodResolver(teamJoinFormSchema),
    defaultValues: {
      resumeId: "",
    },
  });

  const [loading, startLoading] = useTransition();

  const submit = form.handleSubmit((values) => {
    startLoading(async () => {
      await joinTeam(team.id, {
        user_id: user.id,
        resume_id: values.resumeId,
      });
    });
  });

  return [form, loading, submit] as const;
};
