import Form from "@/shared/ui/form";

import ResumeFormEducationField from "../fields/ResumeFormEducationField";
import ResumeFormRoleField from "../fields/ResumeFormRoleField";

export interface ResumeFormMainFieldsetProps
  extends React.ComponentProps<typeof Form.Fieldset> {}

const ResumeFormMainFieldset: React.FunctionComponent<
  ResumeFormMainFieldsetProps
> = (props) => {
  return (
    <Form.Fieldset {...props}>
      <ResumeFormRoleField />
      <ResumeFormEducationField />
    </Form.Fieldset>
  );
};

export default ResumeFormMainFieldset;
