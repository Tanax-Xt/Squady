"use client";

import Bar from "@/shared/ui/bar";
import Page from "@/shared/ui/page";
import Sidebar from "@/shared/ui/sidebar";

export interface SettingsPageLayoutProps extends React.PropsWithChildren {}

const SettingsPageLayout: React.FunctionComponent<SettingsPageLayoutProps> = ({
  children,
}) => {
  const { open, isMobile } = Sidebar.useContext();
  return (
    <Page>
      <Bar>
        {(isMobile || !open) && (
          <Bar.Start>
            <Sidebar.Trigger />
          </Bar.Start>
        )}
        <Bar.Center>Настройки</Bar.Center>
      </Bar>

      <Page.Content size="3xl">{children}</Page.Content>
    </Page>
  );
};

export default SettingsPageLayout;
