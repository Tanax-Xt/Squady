"use client";

import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { memo, useEffect, useState } from "react";

import { cn } from "@/shared/lib/utils";

const icons = {
  light: SunIcon,
  dark: MoonIcon,
  system: MonitorIcon,
} as const;

const labels = {
  light: "Светлая",
  dark: "Тёмная",
  system: "Как в системе",
} as const;

interface ThemeRadioGroupItemProps {
  value: string;
}

export const ThemeRadioGroupItem: React.FunctionComponent<ThemeRadioGroupItemProps> =
  memo(({ value }) => {
    const Icon = icons[value as keyof typeof icons];
    const label = labels[value as keyof typeof labels];

    return (
      <RadioGroupItem
        value={value}
        className="flex cursor-pointer items-center justify-center rounded-sm p-1 text-muted-foreground outline-hidden hover:bg-accent/50 hover:text-foreground aria-checked:cursor-default aria-checked:bg-accent aria-checked:text-foreground data-highlighted:bg-accent"
      >
        <Icon className="size-4 fill-current text-inherit" />
        <span className="sr-only">{label}</span>
      </RadioGroupItem>
    );
  });

ThemeRadioGroupItem.displayName = "ThemeRadioGroupItem";

interface ThemeRadioGroupProps {
  className?: string | undefined;
}

export const ThemeRadioGroup = memo(({ className }: ThemeRadioGroupProps) => {
  const [mounted, setMounted] = useState(false);
  const { theme, themes, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <RadioGroup
      value={mounted ? theme : null}
      onValueChange={setTheme}
      className={cn(
        "flex size-fit items-center justify-center gap-0.5 rounded-md border border-input bg-background p-0.5 has-focus-visible:ring-2 has-focus-visible:ring-ring",
        className,
      )}
    >
      {themes.toReversed().map((theme) => (
        <ThemeRadioGroupItem key={theme} value={theme} />
      ))}
    </RadioGroup>
  );
});

ThemeRadioGroup.displayName = "ThemeRadioGroup";

export default ThemeRadioGroup;
