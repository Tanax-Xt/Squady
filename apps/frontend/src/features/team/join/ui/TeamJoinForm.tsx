"use client";

import { Controller } from "react-hook-form";

import { ResumeIdField } from "@/entities/resume";
import {
  CurrentUserResponse,
  ResumeResponse,
  TeamResponse,
} from "@/shared/api";
import { Button } from "@/shared/ui/button";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardRoot,
  CardTitle,
} from "@/shared/ui/card";
import { FieldGroup, FieldSet } from "@/shared/ui/field";
import Spinner from "@/shared/ui/spinner";

import { useTeamJoinForm } from "../lib/useTeamJoinForm";

function TeamJoinForm({
  team,
  user,
  resumes,
}: {
  team: TeamResponse;
  user: CurrentUserResponse;
  resumes: ResumeResponse[];
}) {
  const [form, loading, submit] = useTeamJoinForm({ team, user });

  return (
    <form onSubmit={submit}>
      <FieldSet disabled={loading}>
        <CardRoot>
          <CardHeader className="border-b">
            <CardTitle>Присоединиться к команде «{team.title}»</CardTitle>
            <CardDescription>
              Вы вошли в систему как {user.username}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <FieldGroup>
              <Controller
                control={form.control}
                name="resumeId"
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

          <CardFooter className="border-t">
            <Button type="submit">
              {loading ? (
                <>
                  <Spinner />
                  Загрузка…
                </>
              ) : (
                <>Присоединиться</>
              )}
            </Button>
          </CardFooter>
        </CardRoot>
      </FieldSet>
    </form>
  );
}

export { TeamJoinForm };
