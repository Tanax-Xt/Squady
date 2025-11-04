import { Toc } from "@/shared/ui/toc";

export default function StaticDocsLayout({
  children,
}: React.PropsWithChildren) {
  return (
    <div className="xl:grid xl:grid-cols-12 xl:gap-24">
      <article className="col-span-9">{children}</article>
      <div className="col-span-3 max-xl:hidden">
        <Toc />
      </div>
    </div>
  );
}
