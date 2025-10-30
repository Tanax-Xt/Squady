"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { CurrentUserResponse, TeamResponse } from "@/shared/api";

import { joinTeam } from "../api/actions";
import {
  teamJoinFormSchema,
  TeamJoinFormSchemaValues,
} from "../model/teamJoinFormSchema";

export const useTeamJoinForm = ({
  team,
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
      const { status } = await joinTeam(team.id, {
        resume_id: values.resumeId,
      });

      if (status === 409) {
        toast.error("Вы уже подали заявку в эту команду!");
      }
    });
  });

  return [form, loading, submit] as const;
};
