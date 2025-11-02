import { z } from "zod";

export const eventEndDateSchema = z.date({
  message: "Введите дату окончанию события.",
});
