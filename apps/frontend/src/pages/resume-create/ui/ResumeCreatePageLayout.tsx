import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

import Bar from "@/shared/ui/bar";
import Button from "@/shared/ui/button";
import Page from "@/shared/ui/page";

export interface ResumeCreatePageLayoutProps extends React.PropsWithChildren {}

const ResumeCreatePageLayout: React.FunctionComponent<
  ResumeCreatePageLayoutProps
> = ({ children }) => {
  return (
    <Page>
      <Bar>
        <Button
          asChild
          variant="ghost"
          className="text-muted-foreground max-md:text-base max-md:[&_svg:not([class*='size-'])]:size-5"
        >
          <Link href="/resume">
            <ArrowLeftIcon />
            <span>Назад</span>
          </Link>
        </Button>

        <Bar.Center>Создание резюме</Bar.Center>
      </Bar>

      <Page.Content size="xl">{children}</Page.Content>
    </Page>
  );
};

export default ResumeCreatePageLayout;
