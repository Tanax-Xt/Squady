"use client";

import Bar from "@/shared/ui/bar";
import Page from "@/shared/ui/page";
import { SidebarTrigger, useSidebar } from "@/shared/ui/sidebar";

export interface HomePageLayoutProps extends React.PropsWithChildren {}

const HomePageLayout: React.FunctionComponent<HomePageLayoutProps> = ({
  children,
}) => {
  const { open, isMobile } = useSidebar();

  return (
    <Page>
      <Bar>
        {(isMobile || !open) && (
          <Bar.Start>
            <SidebarTrigger />
          </Bar.Start>
        )}
        <Bar.Center showAfterScrolled>Главная</Bar.Center>
      </Bar>

      <Page.Content size="3xl" className="gap-4">
        {children}
      </Page.Content>
    </Page>
  );
};

export default HomePageLayout;
