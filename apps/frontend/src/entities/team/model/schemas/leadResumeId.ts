import { z } from "zod";

export const TeamLeadResumeIdSchema = z.string().nonempty("Выберите резюме.");
