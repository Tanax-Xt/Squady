"use client";

import { Controller } from "react-hook-form";

import {
  TeamAboutField,
  TeamTasksField,
  TeamTitleField,
} from "@/entities/team";
import { TeamResponse } from "@/shared/api";
import { Button } from "@/shared/ui/button";
import { CardContent, CardFooter, CardRoot } from "@/shared/ui/card";
import { FieldGroup, FieldSet } from "@/shared/ui/field";
import Spinner from "@/shared/ui/spinner";

import { useTeamEditForm } from "../lib/useTeamEditForm";

function TeamEditForm({ team }: { team: TeamResponse }) {
  const [form, loading, submit] = useTeamEditForm({ team });

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
          </CardContent>

          <CardFooter>
            <Button
              type="submit"
              disabled={!form.formState.isValid || !form.formState.isDirty}
            >
              {loading ? (
                <>
                  <Spinner />
                  Сохранение…
                </>
              ) : (
                <>Сохранить</>
              )}
            </Button>
          </CardFooter>
        </CardRoot>
      </FieldSet>
    </form>
  );
}

export { TeamEditForm };
