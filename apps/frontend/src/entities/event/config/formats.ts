import { EventType } from "@/shared/api";

export const EVENT_FORMATS = ["offline", "online", "hybrid"] as const;

export const EVENT_FORMAT_OPTIONS: {
  value: EventType;
  label: string;
  description: string;
}[] = [
  {
    value: "offline",
    label: "Оффлайн",
    description: "Участники встречаются в указанном месте.",
  },
  {
    value: "online",
    label: "Онлайн",
    description: "Мероприятие проходит полностью удаленно.",
  },
  {
    value: "hybrid",
    label: "Гибрид",
    description: "Сочетание очного и удаленного участия.",
  },
];
