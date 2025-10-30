"use client";

import { Controller } from "react-hook-form";

import { ResumeIdField } from "@/entities/resume";
import {
  TeamAboutField,
  TeamTasksField,
  TeamTitleField,
} from "@/entities/team";
import { ResumeResponse } from "@/shared/api";
import { Button } from "@/shared/ui/button";
import { CardContent, CardFooter, CardRoot } from "@/shared/ui/card";
import { FieldGroup, FieldSet } from "@/shared/ui/field";
import { Separator } from "@/shared/ui/separator";
import Spinner from "@/shared/ui/spinner";

import { useTeamCreateForm } from "../lib/useTeamCreateForm";

function TeamCreateForm({ resumes }: { resumes: ResumeResponse[] }) {
  const [form, loading, submit] = useTeamCreateForm();

  return (
    <form onSubmit={submit}>
      <FieldSet disabled={loading}>
        <CardRoot>
          <CardContent>
            <FieldGroup>
              <Controller
                control={form.control}
                name="title"
                render={TeamTitleField}
              />

              <Controller
                control={form.control}
                name="about"
                render={TeamAboutField}
              />

              <Controller
                control={form.control}
                name="tasks"
                render={TeamTasksField}
              />
            </FieldGroup>

            <Separator className="my-8" />

            <FieldGroup>
              <Controller
                control={form.control}
                name="leadResumeId"
                render={({ field, fieldState }) => (
                  <ResumeIdField
                    field={field}
                    fieldState={fieldState}
                    resumes={resumes}
                  />
                )}
              />
            </FieldGroup>
          </CardContent>

          <CardFooter>
            <Button
              type="submit"
              disabled={!form.formState.isDirty || !form.formState.isValid}
            >
              {loading ? (
                <>
                  <Spinner />
                  Создание команды…
                </>
              ) : (
                <>Создать команду</>
              )}
            </Button>
          </CardFooter>
        </CardRoot>
      </FieldSet>
    </form>
  );
}

export { TeamCreateForm };
