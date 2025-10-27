"use client";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

import { cn } from "@/shared/lib/utils";

import Button from "./button";

interface InputProps extends React.ComponentProps<"input"> {
  before?: React.ReactNode;
  after?: React.ReactNode;
}

function InputRoot({ className, type, before, after, ...props }: InputProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const isPassword = type === "password";

  return (
    <div className="relative w-full">
      {before && (
        <div className="absolute top-1/2 left-3 -translate-y-1/2">{before}</div>
      )}
      <input
        type={isPassword && showPassword ? "text" : type}
        data-slot="input"
        className={cn(
          "flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base transition-[color,box-shadow,border-color] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30",
          "focus-visible:border-ring",
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
          "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
          before && "pl-9",
          (after || isPassword) && "pr-9",
          className,
        )}
        {...props}
      />
      {isPassword && (
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="absolute top-1/2 right-0.75 !size-7.5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          onClick={() => setShowPassword(!showPassword)}
          tabIndex={-1}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {showPassword ? (
              <motion.span
                key="hide"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
              >
                <EyeOffIcon className="size-4" />
                <span className="sr-only">Скрыть пароль</span>
              </motion.span>
            ) : (
              <motion.span
                key="show"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
              >
                <EyeIcon className="size-4" />
                <span className="sr-only">Показать пароль</span>
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      )}
      {after && !isPassword && (
        <div className="absolute top-1/2 right-3 -translate-y-1/2">{after}</div>
      )}
    </div>
  );
}

export { InputRoot };

const Input = InputRoot;

export default Input;
