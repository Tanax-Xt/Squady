"use client";

import { AnimatePresence, motion } from "motion/react";
import { UseFormReturn } from "react-hook-form";

import { cn } from "@/shared/lib/utils";
import Button from "@/shared/ui/button";
import Spinner from "@/shared/ui/spinner";

import { ROLE_OPTIONS } from "./UserRoleOptionRadioGroup";
import { UserUpdateRoleFormFieldValues } from "../model/types";

interface UserUpdateRoleFormFooterProps
  extends Omit<React.ComponentProps<"div">, "children"> {
  form: UseFormReturn<UserUpdateRoleFormFieldValues>;
  pending: boolean;
}

const UserUpdateRoleFormFooter: React.FunctionComponent<
  UserUpdateRoleFormFooterProps
> = ({ form, pending, className, ...otherProps }) => {
  const role = form.watch("role");
  const selectedRoleOption = ROLE_OPTIONS.find(({ value }) => value === role);

  return (
    <footer
      className={cn(
        "mt-4 flex flex-col max-md:sticky max-md:bottom-0 max-md:-mx-4 max-md:mt-auto max-md:-mb-4 max-md:border-t max-md:bg-background max-md:p-4 md:flex-col-reverse",
        className,
      )}
      {...otherProps}
    >
      <Button
        type="submit"
        size="lg"
        loading={pending}
        disabled={!form.formState.isDirty || !role}
        className="mx-auto w-full overflow-clip"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={`${selectedRoleOption ? "option" : ""}${pending ? "pending" : "ready"}`}
            className="flex items-center gap-2"
            initial={{
              y: -25,
              scale: 0.95,
              opacity: 0,
              rotateX: "-60deg",
              filter: "blur(4px)",
            }}
            animate={{
              y: 0,
              scale: 1,
              opacity: 1,
              filter: "blur(0px)",
              rotateX: "0deg",
            }}
            exit={{
              y: 25,
              scale: 0.95,
              opacity: 0,
              filter: "blur(4px)",
              rotateX: "60deg",
            }}
            transition={{ type: "spring", duration: 0.3, bounce: 0 }}
          >
            {pending ? (
              <span className="flex items-center justify-center gap-1">
                <Spinner />
                <span>Сохранение…</span>
              </span>
            ) : selectedRoleOption ? (
              <motion.div
                layout
                className="flex gap-1"
                transition={{
                  type: "tween",
                  ease: "easeOut",
                  duration: 0.15,
                }}
              >
                <motion.div layout="position">Продолжить как</motion.div>
                <motion.div layout="position" className="relative">
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={selectedRoleOption.value}
                      initial={{
                        left: 0,
                        opacity: 0,
                      }}
                      animate={{
                        left: 0,
                        opacity: 1,
                      }}
                      exit={{
                        left: 0,
                        opacity: 0,
                      }}
                      transition={{
                        type: "tween",
                        ease: "easeOut",
                        duration: 0.15,
                      }}
                    >
                      {selectedRoleOption.label.toLowerCase()}
                    </motion.span>
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            ) : (
              <>Выберите свою роль</>
            )}
          </motion.span>
        </AnimatePresence>
      </Button>

      <AnimatePresence>
        {selectedRoleOption?.value === "agent" && (
          <motion.p
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            transition={{
              type: "tween",
              ease: "easeOut",
              duration: 0.15,
            }}
            className="text-muted-foreground max-md:text-center max-md:text-xs md:overflow-clip md:text-sm"
          >
            <span className="-mt-1 block text-pretty max-md:mt-2 md:mb-5">
              Эта роль требует подтверждения. После выбора ваш аккаунт будет
              иметь статус «На проверке».
            </span>
          </motion.p>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default UserUpdateRoleFormFooter;
