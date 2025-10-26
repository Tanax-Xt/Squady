import Bar from "@/shared/ui/bar";
import Page from "@/shared/ui/page";

export interface LoginPageLayoutProps extends React.PropsWithChildren {}

const LoginPageLayout: React.FunctionComponent<LoginPageLayoutProps> = ({
  children,
}) => {
  return (
    <Page>
      <Bar>
        <Bar.Center showAfterScrolled>Вход</Bar.Center>
      </Bar>

      <Page.Content size="md" className="justify-center">
        {children}
      </Page.Content>
    </Page>
  );
};

export default LoginPageLayout;
