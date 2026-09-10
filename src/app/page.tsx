import { Hero } from "@/components/more/Hero";
import { Marquee } from "@/components/more/Marquee";
import { Mission } from "@/components/more/Mission";
import { Benefits } from "@/components/more/Benefits";
import { Flavors } from "@/components/more/Flavors";
import { Comparison } from "@/components/more/Comparison";
import { Reviews } from "@/components/more/Reviews";
import { ProductSlider } from "@/components/more/ProductSlider";
import { CTA } from "@/components/more/CTA";
import { getAllCms } from "@/lib/cms";

export default async function Home() {
  const cms = await getAllCms();

  return (
    <>
      <Hero cms={cms.hero} />
      <Marquee cms={cms.marquee} />
      <Mission cms={cms.mission} />
      <Benefits cms={cms.benefits} />
      <Flavors cms={cms.flavors} />
      <Comparison cms={cms.comparison} />
      <Reviews cms={cms.reviews} />
      <ProductSlider />
      <CTA />
    </>
  );
}
