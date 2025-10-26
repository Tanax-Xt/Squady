"use client";

import { cn } from "@/shared/lib/utils";
import Form from "@/shared/ui/form";

import UserRoleOptionRadioGroup, {
  UserAgentRoleOption,
  UserMentorRoleOption,
  UserParticipantRoleOption,
} from "./UserRoleOptionRadioGroup";
import UserUpdateRoleFormFooter from "./UserUpdateRoleFormFooter";
import UserUpdateRoleFormHeader from "./UserUpdateRoleFormHeader";
import { useUserUpdateRoleForm } from "../model/form";
import { UserUpdateRoleFormFieldValues } from "../model/types";

interface UserUpdateRoleFormProps extends React.ComponentProps<"form"> {
  defaultValues?: UserUpdateRoleFormFieldValues;
}

const UserUpdateRoleForm: React.FunctionComponent<UserUpdateRoleFormProps> = ({
  defaultValues,
  className,
  ...otherProps
}) => {
  const [form, submit, pending] = useUserUpdateRoleForm({ defaultValues });

  return (
    <Form
      {...form}
      onSubmit={submit}
      className={cn("flex flex-col max-md:flex-1 md:justify-center", className)}
      {...otherProps}
    >
      <UserUpdateRoleFormHeader />

      <Form.Fieldset disabled={pending}>
        <Form.Field
          control={form.control}
          name="role"
          render={({ field }) => (
            <UserRoleOptionRadioGroup
              name={field.name}
              disabled={field.disabled || pending}
              defaultValue={field.value}
              onValueChange={field.onChange}
              className="pb-1 max-md:pb-6"
              options={[
                UserParticipantRoleOption,
                UserMentorRoleOption,
                ...(defaultValues ? [] : [UserAgentRoleOption]),
              ]}
            />
          )}
        />
      </Form.Fieldset>

      <UserUpdateRoleFormFooter form={form} pending={pending} />
    </Form>
  );
};

export default UserUpdateRoleForm;
