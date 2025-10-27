import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

import Bar from "@/shared/ui/bar";
import Button from "@/shared/ui/button";
import Page from "@/shared/ui/page";

export interface ResumeCreateHeadHunterPageLayoutProps
  extends React.PropsWithChildren {}

const ResumeCreateHeadHunterPageLayout: React.FunctionComponent<
  ResumeCreateHeadHunterPageLayoutProps
> = ({ children }) => {
  return (
    <Page>
      <Bar>
        <Button
          asChild
          variant="ghost"
          className="text-muted-foreground max-md:text-base max-md:[&_svg:not([class*='size-'])]:size-5"
        >
          <Link href="/resume/create">
            <ArrowLeftIcon />
            <span>Назад</span>
          </Link>
        </Button>

        <Bar.Center>Новое резюме</Bar.Center>
      </Bar>

      <Page.Content size="xl">{children}</Page.Content>
    </Page>
  );
};

export default ResumeCreateHeadHunterPageLayout;
