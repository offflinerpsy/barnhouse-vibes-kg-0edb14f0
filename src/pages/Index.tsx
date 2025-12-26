import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Advantages } from "@/components/landing/Advantages";
import { Catalog } from "@/components/landing/Catalog";
import { Stages } from "@/components/landing/Stages";
import { About } from "@/components/landing/About";
import { FAQ } from "@/components/landing/FAQ";
import { Contact } from "@/components/landing/Contact";
import { Footer } from "@/components/landing/Footer";
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Stages />
      <Catalog />
      <Advantages />
      <About />
      <FAQ />
      <Contact />
      <Footer />
      <Toaster />
    </div>
  );
};

export default Index;
