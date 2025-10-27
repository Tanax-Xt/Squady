"use client";

import { XIcon } from "lucide-react";
import { AnimatePresence, LayoutGroup, motion, Transition } from "motion/react";
import { useMemo } from "react";
import { SubmitHandler, useFieldArray, useFormContext } from "react-hook-form";

import { ResumeSkillFormModal, ResumeSkillFormValues } from "@/entities/resume";
import Collapse from "@/shared/ui/Collapse";
import Badge from "@/shared/ui/badge";
import Button from "@/shared/ui/button";
import Form from "@/shared/ui/form";
import { toast } from "@/shared/ui/sonner";

import { ResumeFormValues } from "../../model/schema/form";

const transition: Transition = {
  scale: { type: "spring", bounce: 0.3, duration: 0.5 },
  type: "spring",
  bounce: 0,
  duration: 0.5,
};

export interface ResumeFormSkillsFieldsetProps
  extends React.ComponentProps<typeof Form.Fieldset> {}

const ResumeFormSkillsFieldset: React.FunctionComponent<
  ResumeFormSkillsFieldsetProps
> = (props) => {
  const form = useFormContext<ResumeFormValues>();
  const array = useFieldArray({ control: form.control, name: "skills" });
  const empty = useMemo(() => !array.fields.length, [array.fields.length]);

  const state = form.getFieldState("skills");

  const append: SubmitHandler<ResumeSkillFormValues> = ({ name }) => {
    const existing = array.fields.find(
      (skill) => skill.name.trim().toLowerCase() === name.trim().toLowerCase(),
    );

    if (existing) {
      toast.error(`Вы уже добавили навык «${existing.name}» в резюме!`);
    } else {
      array.append({ name });
    }
  };

  return (
    <Form.Fieldset {...props}>
      <Form.Legend asterisk data-error={state.invalid}>
        <span>Навыки</span>
        {!empty && (
          <span className="text-muted-foreground tabular-nums">
            ({array.fields.length})
          </span>
        )}
      </Form.Legend>

      {/*<p className={field().description({ className: "!mt-0 !mb-2" })}>
        Укажите навыки, связанные с{" "}
        {role ? `ролью «${role}»` : "выбранной ролью"}. Например, TypeScript,
        React или Next.js:
      </p>*/}

      <LayoutGroup>
        <motion.ul layout="size" className="mb-0 flex flex-wrap gap-1">
          <AnimatePresence mode="popLayout" initial={false}>
            {array.fields.map((skill, index) => (
              <motion.li
                key={skill.id}
                layout="position"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={transition}
              >
                <Badge
                  size="sm"
                  shape="circle"
                  variant="card"
                  className="!font-normal"
                >
                  <span>{skill.name}</span>
                  <Button
                    type="button"
                    size="icon-sm"
                    rounded="full"
                    variant="ghost"
                    className="-my-1 ms-0.5 -me-2 text-muted-foreground"
                    onClick={() => array.remove(index)}
                    aria-label={`Удалить навык "${skill.name}"`}
                  >
                    <XIcon />
                  </Button>
                </Badge>
              </motion.li>
            ))}
          </AnimatePresence>

          <motion.li layout="position" transition={transition}>
            <ResumeSkillFormModal
              trigger={
                <Badge
                  as="button"
                  size="sm"
                  shape="circle"
                  variant="primary-action"
                  className="!font-normal"
                >
                  Добавить
                </Badge>
              }
              onSubmit={append}
            />
          </motion.li>
        </motion.ul>
      </LayoutGroup>

      <Collapse className="mt-2 text-sm text-destructive">
        {state.error?.message}
      </Collapse>
    </Form.Fieldset>
  );
};

export default ResumeFormSkillsFieldset;
