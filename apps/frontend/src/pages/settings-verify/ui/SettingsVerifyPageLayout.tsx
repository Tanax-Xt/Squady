import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

import Bar from "@/shared/ui/bar";
import { Button } from "@/shared/ui/button";
import Page from "@/shared/ui/page";

export interface SettingsVerifyPageLayoutProps
  extends React.PropsWithChildren {}

const SettingsVerifyPageLayout: React.FunctionComponent<
  SettingsVerifyPageLayoutProps
> = ({ children }) => {
  return (
    <Page>
      <Bar>
        <Bar.Start>
          <Button asChild variant="ghost">
            <Link href="/settings">
              <ArrowLeftIcon />
              <span>Назад</span>
            </Link>
          </Button>
        </Bar.Start>

        <Bar.Center>Верификация</Bar.Center>
      </Bar>

      <Page.Content size="md" className="gap-8">
        {children}
      </Page.Content>
    </Page>
  );
};

export default SettingsVerifyPageLayout;
