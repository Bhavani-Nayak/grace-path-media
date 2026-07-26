import type { Ebook } from "@/models/ebook";

export interface ExtendedEbook extends Ebook {
  pdfUrl: string;
}

export const HARDCODED_EBOOKS: ExtendedEbook[] = [
  {
    id: "whispers-of-grace",
    slug: "whispers-of-grace",
    title: "Whispers of Grace",
    author: "Grace Path Media",
    description:
      "A comforting collection of gentle morning reflections, quiet prayers, and Scripture-guided devotionals designed to bring peace to your heart amidst life's storms. Each chapter serves as a sanctuary of quiet words to anchor your spirit.",
    shortDescription:
      "Gentle morning reflections, quiet prayers, and Scripture-guided devotionals.",
    price: 1997, // $19.97
    coverUrl: "/images/Whispers_of_Grace_Typeset.png",
    screenshots: [
      "/images/whisper_of_grace_screenshots.png",
      "/images/whisper_of_grace_screenshots2.png",
    ],
    pdfUrl: "/images/Whispers_of_Grace_Typeset.pdf",
    storagePath: "Whispers_of_Grace_Typeset_czsvpo",
    tags: ["Devotionals", "Prayer", "Peace", "Morning Readings"],
    pageCount: 78,
    readingTime: "15 min daily",
    createdAt: new Date("2026-07-01"),
    updatedAt: new Date("2026-07-01"),
  },
  {
    id: "the-power-of-the-seed",
    slug: "the-power-of-the-seed",
    title: "The Power of the Seed",
    author: "Grace Path Media",
    description:
      "Discover the profound biblical principles of spiritual planting, faith, and patience. Learn how small seeds of faith sown in quiet prayer yield abundant harvests of grace, restoration, and spiritual breakthrough.",
    shortDescription:
      "Pay as you want — enter your desired amount to download.",
    price: 1000, // Default suggested amount $10.00
    isPayWhatYouWant: true,
    minPrice: 100, // Minimum $1.00
    coverUrl: "/images/The_Power_of_the_Seed.png",
    screenshots: [
      "/images/power_of_seed_screenshots.png",
      "/images/power_of_seed_screenshots2.png",
    ],
    pdfUrl: "/images/The_Power_of_the_Seed.pdf",
    storagePath: "The_Power_of_the_Seed_c3184o",
    tags: ["Pay What You Want", "Faith", "Biblical Teaching", "Growth"],
    pageCount: 112,
    readingTime: "22 min",
    createdAt: new Date("2026-07-10"),
    updatedAt: new Date("2026-07-10"),
  },
  {
    id: "letters-of-grace",
    slug: "letters-of-grace",
    title: "Letters of Grace",
    author: "Grace Path Media",
    description:
      "Thirty-one heartfelt, scripture-filled letters offering hope, encouragement, and honest reflection for every season of walking with God. Written for anyone seeking gentle reassurance in quiet moments.",
    shortDescription:
      "Thirty-one heartfelt, scripture-filled letters offering hope and encouragement.",
    price: 2497, // $24.97
    coverUrl: "/images/Letters_of_Grace_Final.png",
    screenshots: [
      "/images/letter_of_grace_screenshots.png",
      "/images/letter_of_grace_screenshots2.png",
    ],
    pdfUrl: "/images/Letters_of_Grace_Final.pdf",
    storagePath: "Letters_of_Grace_Final_kc84lj",
    tags: ["Letters", "Encouragement", "Hope", "Scripture"],
    pageCount: 94,
    readingTime: "18 min",
    createdAt: new Date("2026-07-15"),
    updatedAt: new Date("2026-07-15"),
  },
];
