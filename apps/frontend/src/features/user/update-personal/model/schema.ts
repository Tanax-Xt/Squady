import { z } from "zod";

import {
  UserAbout,
  UserBirthDate,
  UserCity,
  UserFullName,
  UserTelegram,
} from "@/entities/user";

export const ResumeProfileEditFormSchema = z.object({
  full_name: UserFullName,
  birth_date: UserBirthDate,
  city: UserCity,
  telegram: UserTelegram,
  about: UserAbout,
});
