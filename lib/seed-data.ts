/**
 * Seed data for development.
 *
 * Use this to populate Firestore with sample ebooks and blog posts.
 * Run via: npx ts-node --skip-project lib/seed-data.ts
 * (Requires FIREBASE_ADMIN_* env vars to be set)
 */

export const sampleEbooks = [
  {
    slug: "the-quiet-hours",
    title: "The Quiet Hours",
    author: "Grace Path Media",
    description:
      "A collection of short reflections for early mornings and late nights — the moments when the world is still and your thoughts are loudest. Each piece is designed to be read slowly, without rushing, as a small act of care for yourself.",
    shortDescription:
      "Short reflections for early mornings and late nights — read slowly, without rushing.",
    price: 999, // $9.99
    coverUrl: "/images/ebook-cover-placeholder-1.svg", // TODO: replace with real cover
    storagePath: "ebooks/the-quiet-hours.pdf", // Firebase Storage path
    tags: ["Reflections", "Morning Reads", "Short Essays"],
    pageCount: 64,
    readingTime: "12 min",
    createdAt: new Date("2024-09-15"),
    updatedAt: new Date("2024-09-15"),
  },
  {
    slug: "letters-to-no-one",
    title: "Letters To No One",
    author: "Grace Path Media",
    description:
      "Thirty-one letters written to no one in particular — and to everyone at the same time. Each letter explores a different feeling, memory, or moment of reckoning. Honest, unpolished, and deeply human.",
    shortDescription:
      "Thirty-one letters exploring feelings, memories, and moments of reckoning.",
    price: 1299, // $12.99
    coverUrl: "/images/ebook-cover-placeholder-2.svg", // TODO: replace with real cover
    storagePath: "ebooks/letters-to-no-one.pdf",
    tags: ["Letters", "Personal Essays", "Honesty"],
    pageCount: 96,
    readingTime: "18 min",
    createdAt: new Date("2024-11-01"),
    updatedAt: new Date("2024-11-01"),
  },
];

export const sampleBlogPosts = [
  {
    slug: "on-doing-nothing",
    title: "On Doing Nothing",
    excerpt:
      "There's a kind of productivity that only comes from complete stillness. Not the restless, guilt-ridden kind — but the deliberate, chosen kind.",
    content: `
      <p>There's a kind of productivity that only comes from complete stillness. Not the restless, guilt-ridden kind — but the deliberate, chosen kind.</p>
      <p>We've been taught that every hour must be optimized, every gap filled with something useful. But what if the most useful thing you could do today is absolutely nothing?</p>
      <h2>The Art of the Pause</h2>
      <p>Pausing isn't laziness. It's an active decision to let your mind wander, to let ideas simmer, to let your body remember what rest actually feels like.</p>
      <p>The next time you find yourself with an empty hour, resist the urge to fill it. Sit with the discomfort. You might be surprised by what surfaces.</p>
    `,
    author: "Grace Path Media",
    coverUrl: "/images/blog-placeholder.svg", // TODO: replace
    tags: ["Reflection", "Stillness", "Mindfulness"],
    publishedAt: new Date("2025-01-10"),
    updatedAt: new Date("2025-01-10"),
    isPublished: true,
  },
  {
    slug: "the-morning-ritual",
    title: "The Morning Ritual You Don't Need to Optimize",
    excerpt:
      "Your morning doesn't need a protocol. It doesn't need cold plunges, gratitude journals, or a 17-step routine. Sometimes it just needs silence.",
    content: `
      <p>Your morning doesn't need a protocol. It doesn't need cold plunges, gratitude journals, or a 17-step routine. Sometimes it just needs silence.</p>
      <h2>The Pressure to Perform Before 7 AM</h2>
      <p>Somewhere along the way, mornings became another arena for self-improvement. Wake up earlier. Meditate longer. Journal deeper. Move faster.</p>
      <p>But a morning that starts with pressure doesn't set the tone for a peaceful day — it sets the tone for an anxious one.</p>
      <h2>A Different Approach</h2>
      <p>What if your morning ritual was just… waking up? Making something warm to drink. Looking out the window. Letting the day arrive at its own pace.</p>
      <p>Not every morning needs to be a masterclass in discipline. Some mornings just need to be mornings.</p>
    `,
    author: "Grace Path Media",
    coverUrl: "/images/blog-placeholder.svg",
    tags: ["Morning", "Routine", "Anti-Hustle"],
    publishedAt: new Date("2025-01-17"),
    updatedAt: new Date("2025-01-17"),
    isPublished: true,
  },
];
