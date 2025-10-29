import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";

import { createTeam } from "../api/actions";
import { teamCreateFormSchema } from "../model/teamCreateFormSchema";

export const useTeamCreateForm = () => {
  const form = useForm({
    mode: "onChange",
    resolver: zodResolver(teamCreateFormSchema),
    defaultValues: {
      title: "",
      about: "",
      tasks: "",
      leadResumeId: "",
    },
  });

  const [loading, startLoading] = useTransition();

  const submit = form.handleSubmit((values) => {
    startLoading(async () => {
      await createTeam({
        title: values.title,
        about: values.about,
        tasks: values.tasks,
        lead_resume_id: values.leadResumeId,
      });
    });
  });

  return [form, loading, submit] as const;
};
