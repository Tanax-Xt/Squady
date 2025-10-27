import Form from "@/shared/ui/form";

import ResumeFormIsPublicField from "../fields/ResumeFormIsPublicField";

export interface ResumeFormSettingsFieldsetProps
  extends React.ComponentProps<typeof Form.Fieldset> {}

const ResumeFormSettingsFieldset: React.FunctionComponent<
  ResumeFormSettingsFieldsetProps
> = (props) => {
  return (
    <Form.Fieldset {...props}>
      <Form.Legend>Настройки</Form.Legend>

      <ResumeFormIsPublicField />
    </Form.Fieldset>
  );
};

export default ResumeFormSettingsFieldset;
