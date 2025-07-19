import Image from "next/image";
import { Hero, BrandLogos } from "../components/Hero";
import Promo from "../components/Promo/Promo";
import Collection from "../components/Collection/Collection";
import Packages from "../components/Packages/Packages";
import Testimonials from "../components/Testimonials/Testimonials";
import OfferBanner from "../components/OfferBanner/OfferBanner";
import Solution from "../components/Solution/Solution";
import Footer from "../components/Footer/Footer";

export default function Home() {
  return (
    <div className="font-sans min-h-screen">
      <main>
        <Hero />
        <BrandLogos />
        <Solution />
        <Promo />
        <Collection />
        <Packages />
        <Testimonials />
        <OfferBanner />
      </main>
      <Footer />
    </div>
  );
}
