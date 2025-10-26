"use client";

import { OTPInput, OTPInputContext } from "input-otp";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

import { cn } from "@/shared/lib/utils";

function InputOTPRoot({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string;
}) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        "flex items-center gap-2 has-disabled:opacity-50",
        containerClassName,
      )}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  );
}

function InputOTPSlot({
  index,
  valid,
  className,
  ...props
}: React.ComponentProps<typeof motion.div> & {
  index: number;
  valid: null | boolean;
}) {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};

  return (
    <motion.div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        "relative flex size-10 items-center justify-center rounded-md border border-input shadow-xs transition-all outline-none first:border-l data-[active=true]:z-10 data-[active=true]:border-ring data-[active=true]:ring-[3px] data-[active=true]:ring-ring/50 dark:bg-input/30",
        valid === true &&
          "border-success ring-success/40 data-[active=true]:border-success data-[active=true]:ring-success/50",
        valid === false &&
          "border-destructive data-[active=true]:border-destructive data-[active=true]:ring-destructive/20 dark:data-[active=true]:ring-destructive/40",
        className,
      )}
      animate={{
        x: valid === false ? [0, -30, 30, -30, 30, 0] : 0,
      }}
      transition={{
        when: "afterChildren",
        ease: "easeOut",
        duration: 0.5,
      }}
      {...props}
    >
      <AnimatePresence>
        {char && (
          <motion.span
            initial={{
              opacity: 0,
              scale: 0,
              filter: "blur(16px)",
              y: 20,
            }}
            animate={{
              opacity: 1,
              filter: "blur(0px)",
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              filter: "blur(16px)",
              scale: 0,
              y: 20,
            }}
            transition={{
              type: "spring",
              ease: "easeIn",
              duration: 0.5,
            }}
          >
            {char}
          </motion.span>
        )}
      </AnimatePresence>
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink rounded-full bg-foreground duration-1000" />
        </div>
      )}
    </motion.div>
  );
}

export { InputOTPRoot, InputOTPSlot };

const InputOTP = Object.assign(InputOTPRoot, {
  Slot: InputOTPSlot,
});

export default InputOTP;
