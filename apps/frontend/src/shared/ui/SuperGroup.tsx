import { PlusCircleIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useId, useRef, useState } from "react";
import {
  DefaultValues,
  Resolver,
  useForm,
  UseFormGetFieldState,
  UseFormReturn,
} from "react-hook-form";
import { v4 as uuid4 } from "uuid";

import { useIsMobile } from "@/shared/hooks/use-mobile";
import { cn } from "@/shared/lib/utils";
import Cell from "@/shared/ui/Cell";
import Collapse from "@/shared/ui/Collapse";
import Group from "@/shared/ui/Group";
import ActionDialog from "@/shared/ui/action-dialog";
import { Button } from "@/shared/ui/button";
import Dialog from "@/shared/ui/dialog";
import Drawer from "@/shared/ui/drawer";
import Form from "@/shared/ui/form";
import { Separator } from "@/shared/ui/separator";

export type SuperGroupProps<
  TFieldValues extends object,
  TFieldArray extends TFieldValues & { id: string },
> = {
  array: TFieldArray[];
  state: ReturnType<UseFormGetFieldState<TFieldValues>>;
  sort?: (a: TFieldArray, b: TFieldArray) => number;
  onAppend?: (values: TFieldValues) => void;
  onUpdate?: (index: number, values: TFieldValues) => void;
  onRemove?: (index: number) => void;
  formResolver: Resolver<TFieldValues>;
  formDefaultValues?: DefaultValues<TFieldValues>;
  renderCell: (
    item: TFieldArray,
    props: {
      ref: React.Ref<HTMLButtonElement>;
      onClick: React.MouseEventHandler<HTMLButtonElement>;
    },
  ) => React.ReactNode;
  renderForm: (form: UseFormReturn<TFieldValues>) => React.ReactNode;
  legend?: React.ReactNode;
  appendButtonChildren?: React.ReactNode;
  appendTitle: React.ReactNode;
  appendDescription?: React.ReactNode;
  appendSubmit: React.ReactNode;
  updateTitle?: React.ReactNode;
  updateDescription?: React.ReactNode;
  updateSubmit?: React.ReactNode;
  removeButtonChildren?: React.ReactNode;
  removeTitle?: React.ReactNode;
  removeDescription?: React.ReactNode;
  removeAction?: React.ReactNode;
  removeCancel?: React.ReactNode;
};

const SuperGroup = <
  TFieldValues extends object,
  TFieldArray extends TFieldValues & { id: string },
>({
  array,
  state,
  sort,
  onUpdate,
  onRemove,
  onAppend,
  formResolver,
  formDefaultValues,
  renderForm,
  renderCell,
  legend,
  appendButtonChildren,
  appendTitle,
  appendDescription,
  appendSubmit,
  updateTitle,
  updateDescription,
  updateSubmit,
  removeButtonChildren,
  removeTitle,
  removeDescription,
  removeAction,
  removeCancel,
}: SuperGroupProps<TFieldValues, TFieldArray>) => {
  const form = useForm<TFieldValues>({
    mode: "onChange",
    resolver: formResolver,
    defaultValues: formDefaultValues,
  });
  const formId = useId();
  const formSubmitDisabled = !form.formState.isValid || !form.formState.isDirty;

  const isMobile = useIsMobile();

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [removing, setRemoving] = useState<boolean>(false);
  const [updatingIndex, setUpdatingIndex] = useState<number | null>(null);

  const appendButtonRef = useRef<HTMLButtonElement>(null);
  const removeButtonRef = useRef<HTMLButtonElement>(null);
  const cellRefsMap = useRef<Map<number, HTMLElement | null>>(new Map());

  const [items, setItems] = useState<(TFieldValues & { key: string })[]>(
    array.map((item) => ({ ...item, key: uuid4() })),
  );
  const sortedArray = sort ? array.slice().sort(sort) : array;

  const submit = form.handleSubmit((values) => {
    if (updatingIndex !== null) {
      onUpdate?.(updatingIndex, values);
      setItems((prev) => {
        const updatedItems = [...prev];
        updatedItems[updatingIndex] = {
          ...values,
          key: updatedItems[updatingIndex].key,
        };
        return updatedItems;
      });
    } else {
      onAppend?.(values);
      setItems((prev) => [...prev, { ...values, key: uuid4() }]);
    }
  });

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.stopPropagation(); // prevent submitting nested forms
    submit(event);
  };

  const Modal = isMobile ? Drawer : Dialog;

  return (
    <>
      <Form.Fieldset>
        <Form.Legend data-error={state.invalid}>
          <span>{legend}</span>

          {!!sortedArray.length && (
            <span className="text-muted-foreground tabular-nums">
              ({sortedArray.length})
            </span>
          )}
        </Form.Legend>

        <Group divide={false} className="mb-0">
          <Cell
            ref={appendButtonRef}
            as="button"
            type="button"
            size="sm"
            color="primary"
            hoverable
            before={<PlusCircleIcon />}
            label={appendButtonChildren}
            onClick={() => {
              form.reset(formDefaultValues);
              setModalOpen(true);
            }}
          />

          <AnimatePresence initial={false}>
            {sortedArray.map((item) => {
              const originalIndex = array.findIndex(({ id }) => id === item.id);
              const keyedItem = items.at(originalIndex);

              if (!keyedItem) {
                setItems((prev) => {
                  prev.push({ ...item, key: uuid4() });
                  return prev;
                });
              }

              return (
                <motion.div
                  key={keyedItem?.key}
                  layout="position"
                  initial={{ opacity: 0, height: 0, z: -1 }}
                  animate={{ opacity: 1, height: "auto", z: 1 }}
                  exit={{ opacity: 0, height: 0, z: -1 }}
                  transition={{ type: "spring", bounce: 0, duration: 0.5 }}
                  className="bg-card"
                >
                  <Separator />
                  {renderCell(item, {
                    ref: (ref) => {
                      cellRefsMap.current.set(originalIndex, ref);
                    },
                    onClick: () => {
                      const { id: _, ...other } = item;
                      form.reset(other as TFieldValues);
                      setUpdatingIndex(originalIndex);
                      setModalOpen(true);
                    },
                  })}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </Group>

        <Collapse className="mt-2 text-sm text-destructive">
          {state.error?.message}
        </Collapse>
      </Form.Fieldset>

      <Modal open={modalOpen} onOpenChange={setModalOpen}>
        <Modal.Content
          onCloseAutoFocus={() => {
            form.reset();
            if (updatingIndex !== null) {
              cellRefsMap.current.get(updatingIndex)?.focus();
              if (!modalOpen) {
                setUpdatingIndex(null);
              }
            } else {
              appendButtonRef.current?.focus();
            }
          }}
        >
          <Modal.Header>
            <Modal.Title>
              {updatingIndex !== null ? updateTitle : appendTitle}
            </Modal.Title>
            <Modal.Description>
              {updatingIndex !== null ? updateDescription : appendDescription}
            </Modal.Description>
          </Modal.Header>

          <Form
            {...form}
            id={formId}
            className={cn(isMobile && "px-4", "min-w-0")}
            onSubmit={(event) => {
              handleSubmit(event);
              setModalOpen(false);
            }}
          >
            {renderForm(form)}
          </Form>

          <Modal.Footer>
            <Button form={formId} type="submit" disabled={formSubmitDisabled}>
              {updatingIndex !== null ? updateSubmit : appendSubmit}
            </Button>
            {updatingIndex !== null && (
              <Button
                ref={removeButtonRef}
                variant="destructive"
                onClick={() => setRemoving(true)}
              >
                {removeButtonChildren}
              </Button>
            )}
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      <ActionDialog
        variant="destructive"
        title={removeTitle}
        description={removeDescription}
        action={removeAction}
        cancel={removeCancel}
        open={removing}
        onOpenChange={setRemoving}
        onAction={() => {
          if (updatingIndex !== null) {
            onRemove?.(updatingIndex);
            setItems((prev) => prev.filter((_, i) => i !== updatingIndex));
            setRemoving(false);
            setModalOpen(false);
          }
        }}
        onActionCloseAutoFocus={() => appendButtonRef.current?.focus()}
        onCancelCloseAutoFocus={() => removeButtonRef.current?.focus()}
      />
    </>
  );
};

export default SuperGroup;
