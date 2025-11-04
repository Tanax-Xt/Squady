import Page from "@/shared/ui/page";
import { Footer } from "@/widgets/footer";
import { Header } from "@/widgets/header";

export default function StaticLayout({ children }: React.PropsWithChildren) {
  return (
    <Page>
      <Header />
      <Page.Content size="6xl">{children}</Page.Content>
      <Footer />
    </Page>
  );
}
