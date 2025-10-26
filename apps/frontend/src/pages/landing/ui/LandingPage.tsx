import Page from "@/shared/ui/page";

import LandingPageCta from "./LandingPageCta";
import LandingPageFeatures from "./LandingPageFeatures";
import LandingPageFooter from "./LandingPageFooter";
import LandingPageHeader from "./LandingPageHeader";
import LandingPageHero from "./LandingPageHero";

interface LandingPageProps {}

const LandingPage: React.FunctionComponent<LandingPageProps> = () => {
  return (
    <Page>
      <Page.Content size="6xl" className="!p-0">
        <LandingPageHeader />
        <LandingPageHero />
        <LandingPageFeatures />
        <LandingPageCta />
        <LandingPageFooter />
      </Page.Content>
    </Page>
  );
};

export default LandingPage;
