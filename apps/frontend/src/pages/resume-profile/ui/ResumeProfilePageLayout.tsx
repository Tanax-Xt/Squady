"use client";

import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

import Bar from "@/shared/ui/bar";
import { Button } from "@/shared/ui/button";
import Page from "@/shared/ui/page";
import Sidebar from "@/shared/ui/sidebar";

export interface ResumeProfilePageLayoutProps extends React.PropsWithChildren {}

const ResumeProfilePageLayout: React.FunctionComponent<
  ResumeProfilePageLayoutProps
> = ({ children }) => {
  const { open, isMobile } = Sidebar.useContext();

  return (
    <Page>
      <Bar>
        <Bar.Start>
          {!isMobile && !open && <Sidebar.Trigger />}
          <Button
            asChild
            variant="ghost"
            className="text-muted-foreground max-md:text-base max-md:[&_svg:not([class*='size-'])]:size-5"
          >
            <Link href="/resumes">
              <ArrowLeftIcon />
              <span>Назад</span>
            </Link>
          </Button>
        </Bar.Start>

        <Bar.Center>Личные данные</Bar.Center>

        <Bar.End>
          <Button
            asChild
            variant="ghost"
            className="text-muted-foreground max-md:text-base max-md:[&_svg:not([class*='size-'])]:size-5"
          >
            <Link href="/resumes/profile/edit">Изменить</Link>
          </Button>
        </Bar.End>
      </Bar>

      <Page.Content size="3xl">{children}</Page.Content>
    </Page>
  );
};

export default ResumeProfilePageLayout;
