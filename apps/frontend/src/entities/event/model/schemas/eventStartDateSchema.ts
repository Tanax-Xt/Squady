import { z } from "zod";

export const eventStartDateSchema = z.date({
  message: "Введите дату начала события.",
});
