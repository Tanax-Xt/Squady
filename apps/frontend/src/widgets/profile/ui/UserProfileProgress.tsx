"use client";

import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

import {
  CurrentUserPersonalDataResponse,
  CurrentUserResponse,
} from "@/shared/api";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { cn } from "@/shared/lib/utils";
import Badge from "@/shared/ui/badge";
import Button from "@/shared/ui/button";
import Card from "@/shared/ui/card";
import ProgressCircle from "@/shared/ui/progress-circle";

import { remainingLDMLPluralRules, stepLDMLPluralRules } from "../i18n";
import getUserProfileProgress from "../lib/getUserProfileProgress";

export interface UserProfileProgressProps
  extends React.ComponentProps<typeof Card> {
  user: CurrentUserResponse;
  personal: CurrentUserPersonalDataResponse | undefined;
}

const UserProfileProgress: React.FunctionComponent<
  UserProfileProgressProps
> = ({ user, personal, className, ...otherProps }) => {
  const { completedSteps, currentStep, progress, remainingCount, steps } =
    getUserProfileProgress({ user, personal });

  const ordinalPluralRules = new Intl.PluralRules("ru", { type: "ordinal" });
  const cardinalPluralRules = new Intl.PluralRules("ru", { type: "cardinal" });

  const remaingCountRule = cardinalPluralRules.select(remainingCount);
  const stepsLengthRule = ordinalPluralRules.select(steps.length);

  const label = `${remainingLDMLPluralRules[remaingCountRule]} ${remainingCount} ${stepLDMLPluralRules[remaingCountRule]}`;
  const badge = `${completedSteps.length} из ${steps.length} ${stepLDMLPluralRules[stepsLengthRule]} пройдено`;
  const title = "Завершите заполнение профиля";
  const description = `Заполните профиль полностью, чтобы иметь доступ ко всем функциям платформы.`;

  const isMobile = useIsMobile();

  return (
    <Card
      className={cn(
        "items-center justify-center md:flex-row md:p-3",
        className,
      )}
      {...otherProps}
    >
      <ProgressCircle
        size={isMobile ? 144 : 128}
        progress={progress}
        label={label}
      />
      <Card.Header className="flex w-full shrink grow flex-col max-md:items-center max-md:text-center md:px-0 md:py-3">
        <Badge variant="secondary" className="max-md:mb-1">
          {badge}
        </Badge>
        <Card.Title className="text-2xl md:text-xl">{title}</Card.Title>
        <Card.Description className="text-base md:text-sm">
          {description}
        </Card.Description>
        {currentStep && (
          <Button
            disabled={!currentStep.href}
            asChild={!!currentStep.href}
            size={isMobile ? "lg" : "sm"}
            className="mt-2 max-md:w-full"
          >
            {currentStep.href ? (
              <Link href={currentStep.href}>
                <span>{currentStep.label}</span>
                <ArrowRightIcon />
              </Link>
            ) : (
              currentStep.label
            )}
          </Button>
        )}
      </Card.Header>
    </Card>
  );
};

export default UserProfileProgress;
