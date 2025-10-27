"use client";

import Form from "@/shared/ui/form";

import ResumeFormFooter from "./ResumeFormFooter";
import { useResumeForm, UseResumeFormProps } from "../lib/useResumeForm";
import ResumeFormAchievementsFieldset from "./fieldsets/ResumeFormAchievementsFieldset";
import ResumeFormAdditionalEducationFieldset from "./fieldsets/ResumeFormAdditionalEducationFieldset";
import ResumeFormExperienceFieldset from "./fieldsets/ResumeFormExperienceFieldset";
import ResumeFormMainFieldset from "./fieldsets/ResumeFormMainFieldset";
import ResumeFormSettingsFieldset from "./fieldsets/ResumeFormSettingsFieldset";
import ResumeFormSkillsFieldset from "./fieldsets/ResumeFormSkillsFieldset";

export interface ResumeFormProps
  extends UseResumeFormProps,
    Omit<React.ComponentProps<"form">, "children" | "onSubmit"> {
  loading?: boolean;
}

const ResumeForm: React.FunctionComponent<ResumeFormProps> = ({
  persist,
  loading,
  defaultValues,
  onSubmit,
  ...otherProps
}) => {
  const [form, submit] = useResumeForm({ persist, defaultValues, onSubmit });

  return (
    <Form {...form} onSubmit={submit} {...otherProps}>
      <Form.Fieldset className="mb-6">
        <ResumeFormMainFieldset />
        <ResumeFormSkillsFieldset />
        <ResumeFormExperienceFieldset />
        <ResumeFormAchievementsFieldset />
        <ResumeFormAdditionalEducationFieldset />
        <ResumeFormSettingsFieldset />
      </Form.Fieldset>

      <ResumeFormFooter loading={loading} />
    </Form>
  );
};

export default ResumeForm;
