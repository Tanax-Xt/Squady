import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

import Bar from "@/shared/ui/bar";
import { Button } from "@/shared/ui/button";
import Page from "@/shared/ui/page";

export interface ResumeCreatePageLayoutProps extends React.PropsWithChildren {}

const ResumeCreatePageLayout: React.FunctionComponent<
  ResumeCreatePageLayoutProps
> = ({ children }) => {
  return (
    <Page>
      <Bar>
        <Bar.Start>
          <Button asChild variant="ghost">
            <Link href="/resumes">
              <ArrowLeftIcon />
              <span>Назад</span>
            </Link>
          </Button>
        </Bar.Start>

        <Bar.Center>Создание резюме</Bar.Center>
      </Bar>

      <Page.Content size="xl">{children}</Page.Content>
    </Page>
  );
};

export default ResumeCreatePageLayout;
