import { FileUserIcon } from "lucide-react";

import Placeholder from "@/shared/ui/Placeholder";

const ResumeProfileEditFormHeader: React.FunctionComponent = () => {
  return (
    <Placeholder
      before={<FileUserIcon strokeWidth={1.25} />}
      title="Внесите свои личные данные"
      description="Эти данные будут показываться во всех созданных вами резюме."
      classNames={{ root: "mb-6" }}
    />
  );
};

export default ResumeProfileEditFormHeader;
