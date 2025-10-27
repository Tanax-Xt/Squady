"use client";

import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import Bar from "@/shared/ui/bar";
import Button from "@/shared/ui/button";
import Page from "@/shared/ui/page";

export interface ResumeProfileEditPageLayoutProps
  extends React.PropsWithChildren {}

const ResumeProfileEditPageLayout: React.FunctionComponent<
  ResumeProfileEditPageLayoutProps
> = ({ children }) => {
  const searchParams = useSearchParams();
  const dismissible = searchParams?.get("dismissible") === "true";

  return (
    <Page>
      <Bar>
        <Bar.Start>
          {!dismissible && (
            <>
              <Button
                asChild
                variant="ghost"
                className="text-muted-foreground max-md:text-base max-md:[&_svg:not([class*='size-'])]:size-5"
              >
                <Link href="/resume/profile">
                  <ArrowLeftIcon />
                  <span>Назад</span>
                </Link>
              </Button>
            </>
          )}
        </Bar.Start>
        <Bar.Center>
          {dismissible ? "Личные данные" : "Редактирование"}
        </Bar.Center>
      </Bar>

      <Page.Content size="xl">{children}</Page.Content>
    </Page>
  );
};

export default ResumeProfileEditPageLayout;
