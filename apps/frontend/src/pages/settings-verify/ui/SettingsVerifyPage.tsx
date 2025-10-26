import { Metadata } from "next";

import { getCurrentUserUnverified } from "@/entities/user";
import { UserVerifyForm } from "@/features/user/verify";

export const metadata: Metadata = {
  title: "Верификация",
};

const SettingsVerifyPage: React.FunctionComponent = async () => {
  const user = await getCurrentUserUnverified({
    verifiedRedirectUrl: "/settings/role",
  });

  return <UserVerifyForm user={user} />;
};

export default SettingsVerifyPage;
