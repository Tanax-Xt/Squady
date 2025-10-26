import { LogOutIcon } from "lucide-react";

export interface LogoutButtonIdleContentProps {}

const LogoutButtonIdleContent: React.FunctionComponent<
  LogoutButtonIdleContentProps
> = () => {
  return (
    <>
      <LogOutIcon />
      <span>Выйти</span>
    </>
  );
};

export default LogoutButtonIdleContent;
