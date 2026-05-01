export type Member = {
  name: string;
  emoji: string;
  message: string;
  color: string;
  image: string;
};

// Using Unsplash search URLs as placeholders — replaced with stylized portraits via gradient
export const MEMBERS: Member[] = [
  {
    name: "RM",
    emoji: "🐨",
    message: "Leader vibes — keep dreaming big!",
    color: "oklch(0.6 0.18 250)",
    image: "https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?w=600&q=80",
  },
  {
    name: "Jin",
    emoji: "🐹",
    message: "Worldwide handsome sends a kiss 💋",
    color: "oklch(0.75 0.15 30)",
    image: "https://images.unsplash.com/photo-1492446845049-9c50cc313f00?w=600&q=80",
  },
  {
    name: "Suga",
    emoji: "🐱",
    message: "Min Yoongi says: stay genius.",
    color: "oklch(0.5 0.1 280)",
    image: "https://images.unsplash.com/photo-1518806118471-f28b20a1d79d?w=600&q=80",
  },
  {
    name: "J-Hope",
    emoji: "🐿️",
    message: "I'm your hope, you're my hope! ☀️",
    color: "oklch(0.78 0.18 70)",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=600&q=80",
  },
  {
    name: "Jimin",
    emoji: "🐥",
    message: "Got jams? Jimin approves.",
    color: "oklch(0.72 0.18 20)",
    image: "https://images.unsplash.com/photo-1503104834685-7205e8607eb9?w=600&q=80",
  },
  {
    name: "V",
    emoji: "🐯",
    message: "Taehyung says: I purple you 💜",
    color: "oklch(0.6 0.2 305)",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80",
  },
  {
    name: "Jungkook",
    emoji: "🐰",
    message: "Golden Maknae shoots his shot!",
    color: "oklch(0.65 0.2 22)",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&q=80",
  },
];
