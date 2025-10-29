"use client";

import Link from "next/link";

import Bar from "@/shared/ui/bar";
import { Button } from "@/shared/ui/button";
import Page from "@/shared/ui/page";
import Sidebar from "@/shared/ui/sidebar";

export interface ResumePageLayoutProps extends React.PropsWithChildren {}

const ResumePageLayout: React.FunctionComponent<ResumePageLayoutProps> = ({
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

        <Bar.Center showAfterScrolled>Мои резюме</Bar.Center>

        <Bar.End>
          <Button
            asChild
            variant="ghost"
            className="text-muted-foreground max-md:text-base max-md:[&_svg:not([class*='size-'])]:size-5"
          >
            <Link href="/resumes/create">Создать</Link>
          </Button>
        </Bar.End>
      </Bar>

      <Page.Content size="3xl" className="gap-4">
        {children}
      </Page.Content>
    </Page>
  );
};

export default ResumePageLayout;
