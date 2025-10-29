"use client";

import { Controller } from "react-hook-form";

import { Button } from "@/shared/ui/button";
import { FieldSet } from "@/shared/ui/field";
import Spinner from "@/shared/ui/spinner";

import { ResumeProfileFormAboutField } from "./ResumeProfileFormAboutField";
import { ResumeProfileFormBirthDateField } from "./ResumeProfileFormBirthDateField";
import { ResumeProfileFormCityField } from "./ResumeProfileFormCityField";
import { ResumeProfileFormFullNameField } from "./ResumeProfileFormFullNameField";
import { ResumeProfileFormTelegramField } from "./ResumeProfileFormTelegramField";
import { ResumeProfileFormValues } from "../model/resumeProfileFormSchema";
import { useResumeProfileForm } from "../model/useResumeProfileForm";

function ResumeProfileForm({
  defaultValues,
}: {
  defaultValues?: Partial<ResumeProfileFormValues>;
}) {
  const [form, submit, loading] = useResumeProfileForm({ defaultValues });

  return (
    <form id="resume-profile-form" onSubmit={submit}>
      <FieldSet disabled={loading}>
        <Controller
          control={form.control}
          name="full_name"
          render={ResumeProfileFormFullNameField}
        />

        <Controller
          control={form.control}
          name="birth_date"
          render={ResumeProfileFormBirthDateField}
        />

        <Controller
          control={form.control}
          name="city"
          render={ResumeProfileFormCityField}
        />

        <Controller
          control={form.control}
          name="telegram"
          render={ResumeProfileFormTelegramField}
        />

        <Controller
          control={form.control}
          name="about"
          render={ResumeProfileFormAboutField}
        />

        <footer className="flex flex-col max-sm:sticky max-sm:bottom-0 max-sm:-mx-4 max-sm:-mb-6 max-sm:border-t max-sm:bg-background max-sm:p-4">
          <Button
            type="submit"
            disabled={!form.formState.isValid || !form.formState.isDirty}
            className="sm:mr-auto"
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
        </footer>
      </FieldSet>
    </form>
  );
}

export { ResumeProfileForm, type ResumeProfileFormValues };
