import {
  CurrentUserPersonalDataResponse,
  CurrentUserResponse,
  UserResponse,
  UserRole,
} from "@/shared/api";

export type UserProfileProgressStep = {
  href?: string;
  label: string;
  completed: (options: {
    user: CurrentUserResponse;
    personal: CurrentUserPersonalDataResponse | undefined;
  }) => boolean;
};

const SHARED_STEPS: UserProfileProgressStep[] = [
  {
    href: "/register",
    label: "Создать аккаунт",
    completed: ({ user }) => Boolean(user),
  },
  {
    href: "/settings/verify",
    label: "Подтвердить электронную почту",
    completed: ({ user }) => user.is_verified,
  },
  {
    href: "/settings/role",
    label: "Выбрать роль",
    completed: ({ user }) => Boolean(user.role),
  },
];

const AGENT_STEPS: UserProfileProgressStep[] = [
  ...SHARED_STEPS,
  {
    label: "Подтвердить статус представителя",
    completed: ({ user }) => user.is_verified_agent === true,
  },
] as const;

const PARTICIPANT_MENTOR_STEPS: UserProfileProgressStep[] = [
  ...SHARED_STEPS,
  {
    href: "/resume/profile/edit",
    label: "Заполнить личные данные",
    completed: ({ personal }) =>
      personal !== null &&
      personal !== undefined &&
      Object.values(personal).some((value) => value !== null),
  },
  {
    href: "/resume/new",
    label: "Создать первое резюме",
    completed: () => false,
  },
] as const;

const STEPS: Record<UserRole, UserProfileProgressStep[]> = {
  admin: [],
  agent: AGENT_STEPS,
  mentor: PARTICIPANT_MENTOR_STEPS,
  participant: PARTICIPANT_MENTOR_STEPS,
};

export default function getUserProfileProgress({
  user,
  personal,
}: {
  user: UserResponse;
  personal: CurrentUserPersonalDataResponse | undefined;
}) {
  const steps = user.role ? STEPS[user.role] : SHARED_STEPS;
  const currentStep = steps.find(
    ({ completed }) => !completed({ user, personal }),
  );
  const completedSteps = steps.filter(({ completed }) =>
    completed({ user, personal }),
  );
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
