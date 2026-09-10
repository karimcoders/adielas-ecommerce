/**
 * Default content for every CMS-editable section of the storefront.
 * These values are used when a section has never been edited from the
 * admin CMS — i.e. the site looks exactly like the designed version
 * until an admin overrides content from /admin/cms.
 */

export const defaultSettings = {
  storeName: "ADIELAS",
  tagline: "Premium Nutrition for Growing Children",
  phone: "+91 98453 79428",
  email: "info@adielas.com",
  address: "Adielas Nutrition, Indiranagar, Bengaluru, Karnataka - 560038",
  gstNumber: "29ADFPV3524L3ZZ",
  instagramUrl: "https://instagram.com",
  youtubeUrl: "https://youtube.com",
  whatsappNumber: "+91 98453 79428",
  freeShippingThreshold: 499,
  shippingFee: 49,
};

export const defaultHero = {
  brandScript: "adielas",
  headlineLine1: "ANCIENT",
  headlineLine2: "GRAINS MEET",
  headlineLine3: "GROWING KIDS",
  subheadline:
    "Wholesome everyday nutrition for little ones — sprouted millets, multigrains and dry fruits, blended with clinical care. Clean labels, happy tummies, zero shortcuts.",
  noteLine1: "Sprouted Ragi,",
  noteLine2: "Sun-Dried",
  ctaText: "Shop now",
  ctaLink: "/shop",
  stats: [
    { to: 100, unit: "%", label: "Organic Grains" },
    { to: 0, unit: "", label: "Added Sugar" },
    { to: 35, unit: "+", label: "Yrs Expertise" },
  ],
};

export const defaultMarquee = {
  phrases: [
    "GROW EVERY DAY",
    "100% WHOLE SPROUTED RAGI",
    "NO REFINED SUGAR",
    "PEDIATRICIAN FORMULATED",
    "SUN-DRIED IN SMALL BATCHES",
  ],
};

export const defaultMission = {
  eyebrow: "Why Adielas",
  kicker: "Why settle for complicated labels?",
  headingLine1: "YOUR CHILD DESERVES",
  headingLine2: "SIMPLE, HONEST FOOD.",
  description:
    "One brand, three stages, zero compromises — that is ADIELAS Nutrition. Everything in the jar comes from a farm. Nothing in it needs a chemistry degree to read.",
  lead: "Ancient grains, revived for little ones — with clinical care baked into every spoon.",
  checklist: [
    {
      title: "Co-created with a pediatrician",
      body: "Every blend is reviewed and signed off by Dr. Vandana Rao — 35+ years in child healthcare.",
    },
    {
      title: "Sprouted, never processed",
      body: "Grains are sprouted to wake up their nutrients, then naturally sun-dried and stone-milled.",
    },
    {
      title: "The “never” list",
      body: "No added sugar, preservatives, colours, flavours or thickeners. If they don't need it, it stays out.",
    },
  ],
  bubbleValue: "0g",
  bubbleLabel: "Added sugar",
  socialProof: "12k+ parents",
  ctaText: "Shop now",
  doctorNote: "A doctor's promise",
};

export const defaultBenefits = {
  scenes: [
    {
      titleLine1: "MORE",
      titleLine2: "GROWTH",
      highlight: "Sprouted ragi",
      body: "with multigrains and dry fruits — natural protein, fiber and amino acids for steady, healthy growth.",
    },
    {
      titleLine1: "MORE",
      titleLine2: "IMMUNITY",
      highlight: "",
      body: "Plant antioxidants, vitamins and minerals — polyphenols, flavonoids, carotenoids and more, straight from real food.",
    },
    {
      titleLine1: "NO ADDED",
      titleLine2: "SUGAR",
      highlight: "",
      body: "Only the gentle, naturally occurring sweetness of grains and fruits — never a spoonful of refined sugar.",
    },
    {
      titleLine1: "THE 'NEVER'",
      titleLine2: "LIST",
      highlight: "",
      body: "No preservatives, colours, flavours, sweeteners, emulsifiers or thickeners. If a child doesn't need it, it stays out.",
    },
  ],
};

export const defaultFlavors = {
  headingLine1: "One recipe that grows with them —",
  headingLine2: "which stage fits today?",
  stageNote1: "Stage 1\n5 months+",
  stageNote2: "Stage 2\n6 months+",
  stageNote3: "Stage 3\n1 year+",
};

export const defaultComparison = {
  headingLine1: "Every spoon, compared.",
  headingLine2: "The difference is clear.",
  colLeft: "What matters",
  colMid: "adielas",
  colRight: "Sugary kids drinks",
  rows: [
    "No added sugar",
    "No preservatives or colours",
    "Sprouted & sun-dried grains",
    "Pediatrician co-formulated",
    "Plant-based protein & fiber",
    "Naturally occurring nutrients",
    "Stage-wise for growing ages",
  ],
  ctaText: "Start with Stage 1",
  ctaLink: "/shop/stage-1",
};

export const defaultReviews = {
  eyebrow: "Loved by little tummies",
  heading1: "HAPPY KIDS.",
  heading2: "HAPPIER PARENTS.",
  subheading: "DON'T TAKE OUR WORD FOR IT",
  items: [
    {
      title: "Mealtimes made easy!",
      body: "My fussy eater finishes the whole bowl. It mixes smooth, tastes mildly sweet and I know exactly what's inside.",
      name: "Priya S.",
    },
    {
      title: "Clean label, finally.",
      body: "No long chemical names on the pack. Just sprouted grains and dry fruits — exactly what I wanted for my son.",
      name: "Rahul M.",
    },
    {
      title: "Stage 2 is a winner",
      body: "We moved from Stage 1 to Stage 2 seamlessly. Tummy-friendly and keeps him full through the morning.",
      name: "Anita K.",
    },
    {
      title: "Doctor-formulated trust",
      body: "Knowing a pediatrician co-created it gives me real peace of mind. You can taste the quality.",
      name: "Farhan A.",
    },
    {
      title: "Grandma approves too!",
      body: "Three generations agree — it feels like the traditional ragi porridge, just easier and more balanced.",
      name: "Lakshmi V.",
    },
    {
      title: "Travel-friendly nutrition",
      body: "Quick to prepare anywhere. It has become our go-to for daycare lunches and evening hunger pangs.",
      name: "Neha D.",
    },
  ],
};

export const defaultShop = {
  eyebrow: "Shop Adielas",
  heading1: "THE JAR",
  heading2: "WALL",
  description:
    "Three stages of sprouted, sun-dried goodness — pick the age your little one is at today, or take the whole journey home in one box.",
  trust: [
    "Pediatrician formulated",
    "No added sugar. Ever.",
    "Ships in 24–48 hrs",
    "FSSAI certified",
  ],
};

export const defaultFooter = {
  aboutText:
    "Clean, honest nutrition for growing children — sprouted grains, sun-dried in small batches and co-created with a pediatrician.",
  ctaText: "Shop Stages",
  copyrightText: "All rights reserved.",
};

export const cmsSections = [
  "settings",
  "hero",
  "marquee",
  "mission",
  "benefits",
  "flavors",
  "comparison",
  "reviews",
  "shop",
  "footer",
] as const;

export type CmsSectionKey = (typeof cmsSections)[number];
