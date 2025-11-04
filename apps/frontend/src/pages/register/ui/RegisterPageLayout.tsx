"use client";

import Bar from "@/shared/ui/bar";
import Page from "@/shared/ui/page";

export interface RegisterPageLayoutProps extends React.PropsWithChildren {}

const RegisterPageLayout: React.FunctionComponent<RegisterPageLayoutProps> = ({
  children,
}) => {
  return (
    <Page>
      <Bar>
        <Bar.Center showAfterScrolled>Регистрация</Bar.Center>
      </Bar>

      <Page.Content size="md" className="justify-center">
        {children}
      </Page.Content>
    </Page>
  );
};

export default RegisterPageLayout;
