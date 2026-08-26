export type Product = {
  slug: string;
  /** two display lines used in big headings */
  nameLines: [string, string];
  name: string;
  stageLabel: string;
  ageLabel: string;
  price: number;
  mrp?: number;
  weight: string;
  tagline: string;
  description: string[];
  highlights: string[];
  ingredients: string;
  nutrition: { label: string; value: string }[];
  howTo: string;
  image: string;
  cut?: string;
  accent: string;
  /** soft background wash derived from the pack colour — drives the stage-picker section bg */
  wash?: string;
  rating: number;
  reviews: number;
};

export const FREE_SHIPPING_THRESHOLD = 499;
export const SHIPPING_FEE = 49;

export const products: Product[] = [
  {
    slug: "stage-1",
    nameLines: ["STAGE 1", "SPROUTED RAGI"],
    name: "Stage 1 · Sprouted Ragi",
    stageLabel: "FIRST WEANING",
    ageLabel: "5 months +",
    price: 299,
    mrp: 349,
    weight: "400 g",
    tagline: "A gentle first spoon — single-grain sprouted ragi, nothing else.",
    description: [
      "Stage 1 is where the journey begins. A single hero grain — finger millet (ragi) — carefully sprouted to wake up its natural enzymes, then slowly sun-dried and stone-milled into a silky powder that first-timers digest easily.",
      "There is exactly one ingredient in the pack. No milk powder, no sugar, no flavourings, no thickeners. Just honest grain, so your baby's very first tastes stay simple and true.",
    ],
    highlights: [
      "Single ingredient: whole sprouted ragi",
      "Naturally rich in calcium & iron",
      "Smooth texture, easy on tiny tummies",
    ],
    ingredients:
      "100% organically grown ragi (finger millet), sprouted and sun-dried. That's it — one ingredient, nothing added, nothing removed.",
    nutrition: [
      { label: "Energy", value: "384 kcal" },
      { label: "Protein", value: "9.8 g" },
      { label: "Dietary fiber", value: "8.2 g" },
      { label: "Calcium", value: "364 mg" },
      { label: "Iron", value: "6.1 mg" },
      { label: "Added sugar", value: "0 g" },
    ],
    howTo:
      "Mix 2 tbsp with warm water or milk to a smooth paste, then cook on low heat for 2–3 minutes stirring gently. Cool to body temperature before feeding. Always taste before serving.",
    image: "/images/adielas/stage1.png",
    cut: "/images/adielas/stage1-cut.png",
    accent: "#D9A441",
    wash: "#EFDCA4",
    rating: 4.9,
    reviews: 128,
  },
  {
    slug: "stage-2",
    nameLines: ["STAGE 2", "MULTIGRAIN"],
    name: "Stage 2 · Multigrain Medley",
    stageLabel: "MULTIGRAIN",
    ageLabel: "6 months +",
    price: 399,
    mrp: 449,
    weight: "400 g",
    tagline: "Ragi now has company — four ancient grains, one happy bowl.",
    description: [
      "Stage 2 widens the plate. Sprouted ragi meets jowar, bajra and roasted rice — a medley of millets and grains that introduces new textures and a fuller amino-acid profile as your little one gets curious about taste.",
      "Every grain is sprouted separately for better digestibility, sun-dried the old way, and blended in proportions worked out with our pediatrician. Zero sugar, zero shortcuts.",
    ],
    highlights: [
      "Four sprouted grains in one bowl",
      "Complete plant protein profile",
      "Keeps them fuller, steadier energy",
    ],
    ingredients:
      "Sprouted ragi (finger millet), jowar (sorghum), bajra (pearl millet), roasted rice. All grains organically sourced, sprouted and naturally sun-dried.",
    nutrition: [
      { label: "Energy", value: "396 kcal" },
      { label: "Protein", value: "11.4 g" },
      { label: "Dietary fiber", value: "7.6 g" },
      { label: "Calcium", value: "289 mg" },
      { label: "Iron", value: "5.4 mg" },
      { label: "Added sugar", value: "0 g" },
    ],
    howTo:
      "Whisk 2–3 tbsp into 120 ml water or milk until lump-free. Cook on low flame for 3–4 minutes until it thickens, stir in a spoon of ghee if you like. Serve warm, not hot.",
    image: "/images/adielas/stage2.png",
    cut: "/images/adielas/stage2-cut.png",
    accent: "#B5793B",
    wash: "#F2CD96",
    rating: 4.8,
    reviews: 96,
  },
  {
    slug: "stage-3",
    nameLines: ["STAGE 3", "DRY FRUITS"],
    name: "Stage 3 · Dry Fruits Blend",
    stageLabel: "DRY FRUITS",
    ageLabel: "1 year +",
    price: 475,
    mrp: 525,
    weight: "400 g",
    tagline: "The big-kid bowl — multigrains folded with premium dry fruits.",
    description: [
      "Stage 3 is our richest blend yet. The Stage 2 multigrain base is gently folded with almond, cashew and dates powder — finely milled so it stays smooth while bringing deeper flavour, healthy fats and natural sweetness.",
      "The mild sweetness comes only from the dates and nuts themselves — never from added sugar. It's the porridge toddlers actually finish, and parents feel good about.",
    ],
    highlights: [
      "Almonds, cashews & date powder inside",
      "Healthy fats for brain development",
      "Naturally sweet — zero refined sugar",
    ],
    ingredients:
      "Sprouted multigrain base (ragi, jowar, bajra, rice) with almond, cashew and date powder. Dry fruits are cleaned, slow-roasted and stone-milled in small batches.",
    nutrition: [
      { label: "Energy", value: "421 kcal" },
      { label: "Protein", value: "12.9 g" },
      { label: "Dietary fiber", value: "7.1 g" },
      { label: "Calcium", value: "258 mg" },
      { label: "Iron", value: "4.9 mg" },
      { label: "Added sugar", value: "0 g" },
    ],
    howTo:
      "Stir 3 tbsp into 150 ml milk or water, cook for 3–4 minutes till creamy, and top with mashed banana or stewed apple for older toddlers. Serve lukewarm.",
    image: "/images/adielas/stage3.png",
    cut: "/images/adielas/stage3-cut.png",
    accent: "#5C2B2E",
    wash: "#EBC9BF",
    rating: 5.0,
    reviews: 141,
  },
  {
    slug: "starter-trio",
    nameLines: ["STARTER", "TRIO"],
    name: "The Starter Trio · Stages 1 + 2 + 3",
    stageLabel: "BEST VALUE",
    ageLabel: "All stages",
    price: 999,
    mrp: 1173,
    weight: "3 × 400 g",
    tagline: "All three jars in one box — the journey, start to finish.",
    description: [
      "One box, three jars, the whole ADIELAS journey. Start with single-grain Stage 1, graduate to the multigrain medley, and celebrate milestones with the dry-fruits blend.",
      "It also makes gift-giving simple — new parents get the complete stage system in one go, at nearly ₹175 less than buying each jar separately.",
    ],
    highlights: [
      "Save ₹174 vs buying jars separately",
      "Great first-birthday & baby-shower gift",
      "Full 3-stage feeding guide included",
    ],
    ingredients:
      "One jar each of Stage 1 (Sprouted Ragi), Stage 2 (Multigrain) and Stage 3 (Dry Fruits). See individual jars for full ingredient lists.",
    nutrition: [
      { label: "Jars", value: "3 × 400 g" },
      { label: "Servings", value: "~60 bowls total" },
      { label: "Shelf life", value: "6 months from packing" },
      { label: "Added sugar", value: "0 g across all stages" },
    ],
    howTo:
      "Begin with Stage 1 once your pediatrician green-signs solids around 5–6 months. Move to Stage 2 after two comfortable weeks, and Stage 3 around the first birthday.",
    image: "/images/adielas/jar-trio.png",
    accent: "#A98139",
    rating: 4.9,
    reviews: 57,
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function formatINR(n: number): string {
  return `₹${n.toLocaleString("en-IN")}`;
}

export type CartItem = { slug: string; qty: number };

export function cartLineTotal(items: CartItem[]): number {
  return items.reduce((sum, it) => {
    const p = getProduct(it.slug);
    return sum + (p ? p.price * it.qty : 0);
  }, 0);
}
