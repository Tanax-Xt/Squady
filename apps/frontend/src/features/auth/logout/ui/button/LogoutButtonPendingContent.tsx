import Spinner from "@/shared/ui/spinner";

export interface LogoutButtonPendingContentProps {}

const LogoutButtonPendingContent: React.FunctionComponent<
  LogoutButtonPendingContentProps
> = () => {
  return (
    <>
      <Spinner />
      <span>Выполняется выход…</span>
    </>
  );
};

export default LogoutButtonPendingContent;
