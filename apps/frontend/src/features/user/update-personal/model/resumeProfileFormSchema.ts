import { z } from "zod";

import {
  UserAbout,
  UserBirthDate,
  UserCity,
  UserFullName,
  UserTelegram,
} from "@/entities/user";

const resumeProfileFormSchema = z.object({
  full_name: UserFullName,
  birth_date: UserBirthDate,
  city: UserCity,
  telegram: UserTelegram,
  about: UserAbout,
});

type ResumeProfileFormValues = z.infer<typeof resumeProfileFormSchema>;

export { resumeProfileFormSchema, type ResumeProfileFormValues };
