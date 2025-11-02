import { z } from "zod";

import { EVENT_FORMATS } from "../../config/formats";

export const eventFormatSchema = z.enum(EVENT_FORMATS, {
  message: "Выберите формат события.",
});
