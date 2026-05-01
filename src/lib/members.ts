export type Member = {
  name: string;
  emoji: string;
  message: string;
  /** Extra fan-style lines shown under the GIF. */
  extraLines: string[];
  color: string;
  /** Primary GIF (kept for backwards compatibility — equals gifs[0]). */
  image: string;
  /** Six GIF sources per member. A random one is picked on each reveal. */
  gifs: string[];
};

const gif = (id: string) => `https://i.giphy.com/${id}.gif`;

// Real GIPHY IDs scraped per member — 6 each.
const GIF_IDS: Record<string, string[]> = {
  RM: [
    "S6qoW2p2rZlGbu8hbf",
    "kdEQkGskUt5zY70JEm",
    "VDkKQ6Lxb63yQhFzVA",
    "kFONd4NlgbfOIUnWGS",
    "kdA9e14P8NQxlBUDZT",
    "IhgIx0jbM2Jq48jgRq",
  ],
  Jin: [
    "J2g3P91ZMxhTbmactz",
    "xDArG0qJUKq4UjrMiy",
    "lqB0EiHZaSF1kWTIZp",
    "kclIyzulaVDC9hlP6K",
    "d7lm7WOKQh2R3PWtFF",
    "db33tz5hDOfYkMSPkL",
  ],
  Suga: [
    "MH8N8clZyWrq7m5PP2",
    "CXBFwghctpzOr0oDZm",
    "Bs00NTFiDMB71q7FQh",
    "immmR05HmTNLy85Fjx",
    "Osl0oZivnzmnfOVC5k",
    "h4Cwi36DQxjIwXPkbR",
  ],
  "J-Hope": [
    "XZOKERQh2hDfCpZx28",
    "jWpM0iEevwSFkrotnS",
    "PmifcIJoDYyKDG1rgJ",
    "Q5jUhDrepSHIlzinNA",
    "hR6ExHD6KSKiIU4MVC",
    "93GggZO51or4Ql86X0",
  ],
  Jimin: [
    "AVpN60QtLiRhnJwqJj",
    "kcOnMlLGjqdo1Hmmow",
    "cIDp4M6ShhhuqNU6oN",
    "XcX4IoB8bEhHPfWqdx",
    "QC6UdPtXxeiIwimAZi",
    "QX769HOrcPF3ybTp8s",
  ],
  V: [
    "JCNhMC4Izai0o0lnZZ",
    "brOtxhYQ5cgzinzryn",
    "3JUFRUEZUYHN1xsSkE",
    "XZyruwKFmrbgzMtsJI",
    "ZE0fHXI94G3TY8WVzO",
    "VgTdYbS4et7iUkUCep",
  ],
  Jungkook: [
    "5KOpwjblxOKWT7kJ0P",
    "F3aSGkJWxTHdIpo6qH",
    "eLvyT3aER47YpB8BK2",
    "dXXPAbv564VxGMKkEX",
    "fVbajGtTy6GG6UY3iG",
    "xT1XGL0RD3wsJl1xEA",
  ],
};

const make = (
  name: string,
  emoji: string,
  message: string,
  color: string,
): Member => {
  const gifs = GIF_IDS[name].map(gif);
  return { name, emoji, message, color, gifs, image: gifs[0] };
};

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
