export type Member = {
  name: string;
  emoji: string;
  message: string;
  color: string;
  /** Primary GIF (kept for backwards compatibility — equals gifs[0]). */
  image: string;
  /** Six GIF sources per member. A random one is picked on each reveal. */
  gifs: string[];
};

// Curated GIF pools per member (Tenor / Giphy direct .gif links).
// Each member has 6 GIFs — a random one is picked each time the member appears.
const GIFS: Record<string, string[]> = {
  RM: [
    "https://media.tenor.com/9o7m_GmCqoEAAAAC/bts-rm.gif",
    "https://media.tenor.com/0YwQK0sJpC4AAAAC/rm-bts.gif",
    "https://media.tenor.com/Yk2yQfZ1g0YAAAAC/rm-namjoon.gif",
    "https://media.tenor.com/2g4r9wZxqg8AAAAC/rm-bts.gif",
    "https://media.tenor.com/sH7lWk6bP-IAAAAC/bts-rm.gif",
    "https://media.tenor.com/Hf3oH3kqRkkAAAAC/namjoon-rm.gif",
  ],
  Jin: [
    "https://media.tenor.com/x1Y3p3y4bMQAAAAC/bts-jin.gif",
    "https://media.tenor.com/ZkH5g8WQ5EwAAAAC/jin-bts.gif",
    "https://media.tenor.com/4l7m9Y3kK4QAAAAC/jin-seokjin.gif",
    "https://media.tenor.com/F1XJk2bD0WkAAAAC/jin-bts.gif",
    "https://media.tenor.com/9bL1k4u4KrwAAAAC/bts-jin.gif",
    "https://media.tenor.com/sQ8oM7v3vEAAAAAC/jin-bts.gif",
  ],
  Suga: [
    "https://media.tenor.com/3p3VXyYmOiUAAAAC/suga-bts.gif",
    "https://media.tenor.com/G7c1g3l1m9cAAAAC/suga-yoongi.gif",
    "https://media.tenor.com/J9o0xN3v9k0AAAAC/suga-bts.gif",
    "https://media.tenor.com/M1zP3o3l3rwAAAAC/yoongi-suga.gif",
    "https://media.tenor.com/Wq1m4u4k4rwAAAAC/suga-bts.gif",
    "https://media.tenor.com/aB2cD3eF4gAAAAC/min-yoongi.gif",
  ],
  "J-Hope": [
    "https://media.tenor.com/H7p3Qx2y4mAAAAAC/jhope-bts.gif",
    "https://media.tenor.com/K4l1m2n3oPAAAAAC/jhope-hoseok.gif",
    "https://media.tenor.com/L8m9n0p1qRAAAAAC/jhope-bts.gif",
    "https://media.tenor.com/N2o3p4q5rSAAAAAC/hoseok-jhope.gif",
    "https://media.tenor.com/P6q7r8s9tUAAAAAC/jhope-bts.gif",
    "https://media.tenor.com/R0s1t2u3vWAAAAAC/jung-hoseok.gif",
  ],
  Jimin: [
    "https://media.tenor.com/T4u5v6w7xYAAAAAC/jimin-bts.gif",
    "https://media.tenor.com/V8w9x0y1zAAAAAAC/park-jimin.gif",
    "https://media.tenor.com/X2y3z4a5bCAAAAAC/jimin-bts.gif",
    "https://media.tenor.com/Z6a7b8c9dEAAAAAC/jimin-cute.gif",
    "https://media.tenor.com/B0c1d2e3fGAAAAAC/jimin-bts.gif",
    "https://media.tenor.com/D4e5f6g7hIAAAAAC/park-jimin-bts.gif",
  ],
  V: [
    "https://media.tenor.com/F8g9h0i1jKAAAAAC/v-bts.gif",
    "https://media.tenor.com/H2i3j4k5lMAAAAAC/taehyung-v.gif",
    "https://media.tenor.com/J6k7l8m9nOAAAAAC/v-bts.gif",
    "https://media.tenor.com/L0m1n2o3pQAAAAAC/kim-taehyung.gif",
    "https://media.tenor.com/N4o5p6q7rSAAAAAC/v-bts.gif",
    "https://media.tenor.com/P8q9r0s1tUAAAAAC/taehyung-bts.gif",
  ],
  Jungkook: [
    "https://media.tenor.com/R2s3t4u5vWAAAAAC/jungkook-bts.gif",
    "https://media.tenor.com/T6u7v8w9xYAAAAAC/jeon-jungkook.gif",
    "https://media.tenor.com/V0w1x2y3zAAAAAAC/jungkook-bts.gif",
    "https://media.tenor.com/X4y5z6a7bCAAAAAC/jungkook-cute.gif",
    "https://media.tenor.com/Z8a9b0c1dEAAAAAC/jungkook-bts.gif",
    "https://media.tenor.com/B2c3d4e5fGAAAAAC/golden-maknae.gif",
  ],
};

const make = (
  name: string,
  emoji: string,
  message: string,
  color: string,
): Member => ({
  name,
  emoji,
  message,
  color,
  gifs: GIFS[name],
  image: GIFS[name][0],
});

export const MEMBERS: Member[] = [
  make("RM", "🐨", "Leader vibes — keep dreaming big!", "oklch(0.6 0.18 250)"),
  make("Jin", "🐹", "Worldwide handsome sends a kiss 💋", "oklch(0.75 0.15 30)"),
  make("Suga", "🐱", "Min Yoongi says: stay genius.", "oklch(0.5 0.1 280)"),
  make("J-Hope", "🐿️", "I'm your hope, you're my hope! ☀️", "oklch(0.78 0.18 70)"),
  make("Jimin", "🐥", "Got jams? Jimin approves.", "oklch(0.72 0.18 20)"),
  make("V", "🐯", "Taehyung says: I purple you 💜", "oklch(0.6 0.2 305)"),
  make("Jungkook", "🐰", "Golden Maknae shoots his shot!", "oklch(0.65 0.2 22)"),
];

/** Pick a random GIF for a member each time it's revealed. */
export function pickGif(member: Member): string {
  return member.gifs[Math.floor(Math.random() * member.gifs.length)];
}
