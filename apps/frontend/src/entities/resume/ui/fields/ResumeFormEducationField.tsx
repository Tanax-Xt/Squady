import {
  ChevronRightIcon,
  GraduationCapIcon,
  PlusCircleIcon,
} from "lucide-react";
import { SubmitHandler, useFormContext } from "react-hook-form";

import {
  getEducationTypeDisplayName,
  ResumeEducationFormModal,
  ResumeEducationFormValues,
} from "@/entities/resume";
import Cell from "@/shared/ui/Cell";
import Group from "@/shared/ui/Group";
import { legend } from "@/shared/ui/form";

import { ResumeFormValues } from "../../model/schema/form";

const ResumeFormEducationField: React.FunctionComponent = () => {
  const form = useFormContext<ResumeFormValues>();

  const education = form.watch("education");

  const handleSubmit: SubmitHandler<ResumeEducationFormValues> = (values) => {
    form.setValue("education", values, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  return (
    <>
      <p className={legend({ asterisk: true })}>Учебное заведение</p>

      <Group>
        <ResumeEducationFormModal
          trigger={
            <Cell
              as="button"
              type="button"
              size="sm"
              color={education ? "default" : "primary"}
              hoverable
              multiline
              before={
                education ? (
                  <GraduationCapIcon className="!mt-0" />
                ) : (
                  <PlusCircleIcon />
                )
              }
              label={
                education
                  ? `${education.title} – ${education.endYear}`
                  : "Указать учебное заведение"
              }
              description={
                education && getEducationTypeDisplayName(education.type)
              }
              after={education && <ChevronRightIcon />}
            />
          }
          onSubmit={handleSubmit}
          defaultValues={education}
        />
      </Group>
    </>
  );
};

export default ResumeFormEducationField;
