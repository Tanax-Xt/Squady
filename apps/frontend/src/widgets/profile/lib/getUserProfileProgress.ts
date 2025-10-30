import { hasAnyPersonalData } from "@/entities/user";
import { CurrentUserResponse, UserRole } from "@/shared/api";

export type UserProfileProgressStep = {
  id: string;
  href?: string;
  label: string;
  completed: (user: CurrentUserResponse) => boolean;
};

const SHARED_STEPS: UserProfileProgressStep[] = [
  {
    id: "register",
    href: "/register",
    label: "Создать аккаунт",
    completed: (user) => Boolean(user),
  },
  {
    id: "verify",
    href: "/settings/verify",
    label: "Подтвердить электронную почту",
    completed: ({ is_verified }) => is_verified,
  },
  {
    id: "role",
    href: "/settings/role",
    label: "Выбрать роль",
    completed: ({ role }) => Boolean(role),
  },
];

const AGENT_STEPS: UserProfileProgressStep[] = [
  ...SHARED_STEPS,
  {
    id: "verify-agent",
    label: "Подтвердить статус представителя",
    completed: ({ is_verified_agent }) => !!is_verified_agent,
  },
] as const;

const PARTICIPANT_MENTOR_STEPS: UserProfileProgressStep[] = [
  ...SHARED_STEPS,
  {
    id: "personal",
    href: "/resumes/profile/edit",
    label: "Заполнить личные данные",
    completed: (user) => hasAnyPersonalData(user),
  },
  {
    id: "resume",
    href: "/resumes/create",
    label: "Создать первое резюме",
    completed: (user) => user.stats.resumes > 0,
  },
  {
    id: "team",
    href: "/teams",
    label: "Найти или создать команду",
    completed: (user) => user.stats.teams > 0,
  },
] as const;

const STEPS: Record<UserRole, UserProfileProgressStep[]> = {
  admin: [],
  agent: AGENT_STEPS,
  mentor: PARTICIPANT_MENTOR_STEPS,
  participant: PARTICIPANT_MENTOR_STEPS,
};

export default function getUserProfileProgress(user: CurrentUserResponse) {
  const steps = user.role ? STEPS[user.role] : SHARED_STEPS;
  const currentStep = steps.find(({ completed }) => !completed(user));
  const completedSteps = steps.filter(({ completed }) => completed(user));
  const remainingCount = steps.length - completedSteps.length;
  const progress = Math.round((completedSteps.length / steps.length) * 100);

  return {
    currentStep,
    completedSteps,
    remainingCount,
    progress,
    steps,
  } as const;
}
