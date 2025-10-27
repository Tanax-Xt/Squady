"use client";

import { DramaIcon } from "lucide-react";

import Placeholder from "@/shared/ui/Placeholder";

const UserUpdateRoleFormHeader: React.FunctionComponent = () => {
  return (
    <Placeholder
      before={<DramaIcon strokeWidth={1.25} />}
      title="Выберите свою роль"
      description="Это поможет настроить платформу под ваши потребности"
      classNames={{ root: "grow-0" }}
    />
  );
};

export default UserUpdateRoleFormHeader;
