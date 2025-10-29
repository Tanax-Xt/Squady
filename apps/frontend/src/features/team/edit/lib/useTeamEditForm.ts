import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";

import { TeamResponse } from "@/shared/api";

import { updateTeam } from "../api/actions";
import {
  teamEditFormSchema,
  TeamEditFormSchemaValues,
} from "../model/teamEditFormSchema";

export const useTeamEditForm = ({ team }: { team: TeamResponse }) => {
  const form = useForm<TeamEditFormSchemaValues>({
    mode: "onChange",
    resolver: zodResolver(teamEditFormSchema),
    defaultValues: {
      title: team.title,
      about: team.about ?? "",
      tasks: team.tasks ?? "",
    },
  });

  const [loading, startLoading] = useTransition();

  const submit = form.handleSubmit((values) => {
    startLoading(async () => {
      await updateTeam(team.id, {
        title: values.title,
        about: values.about,
        tasks: values.tasks,
      });
    });
  });

  return [form, loading, submit] as const;
};
