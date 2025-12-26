import { FooterSkyline } from "@/components/landing/FooterSkyline";

const FooterDebug = () => {
  return (
    <main className="min-h-screen bg-background">
      <h1 className="sr-only">Footer skyline debug</h1>

      <section className="w-full">
        <div className="h-[260px]">
          <FooterSkyline variant="standalone" />
        </div>
        <div className="h-[140px] bg-charcoal" />
      </section>
    </main>
  );
};

export default FooterDebug;
