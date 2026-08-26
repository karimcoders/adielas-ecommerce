import { Hero } from "@/components/more/Hero";
import { Marquee } from "@/components/more/Marquee";
import { Mission } from "@/components/more/Mission";
import { Benefits } from "@/components/more/Benefits";
import { Flavors } from "@/components/more/Flavors";
import { Comparison } from "@/components/more/Comparison";
import { Reviews } from "@/components/more/Reviews";
import { ProductSlider } from "@/components/more/ProductSlider";
import { CTA } from "@/components/more/CTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Mission />
      <Benefits />
      <Flavors />
      <Comparison />
      <Reviews />
      <ProductSlider />
      <CTA />
    </>
  );
}
