/* ══════════════════════════════════════
   MovieVerse — data.js
   Replace with TMDB API calls for real data
   ══════════════════════════════════════ */

const movies = [
  {
    id: 1,
    title: "Echoes of the Abyss",
    year: 2024,
    rating: 8.7,
    duration: "2h 18m",
    genre: ["Sci-Fi", "Thriller"],
    emoji: "🌌",
    isNew: true,
    desc: "A deep-space crew discovers a signal older than the universe itself — and something on the other end is listening. A gripping tale of survival, identity, and the unknown.",
    cast: ["Elena Voss", "Marcus Rhyne", "Saya Tanaka", "Pol Darcourt"]
  },
  {
    id: 2,
    title: "Crimson Divide",
    year: 2024,
    rating: 7.9,
    duration: "1h 52m",
    genre: ["Action", "Drama"],
    emoji: "🔥",
    isNew: true,
    desc: "Two rival agents from opposing governments must cooperate to prevent a catastrophic geopolitical collapse.",
    cast: ["Damon Reeves", "Tara Solis", "Jin Park"]
  },
  {
    id: 3,
    title: "The Hollow King",
    year: 2023,
    rating: 8.2,
    duration: "2h 05m",
    genre: ["Horror", "Thriller"],
    emoji: "👑",
    isNew: false,
    desc: "A medieval monarch begins to suspect his bloodline carries a curse that turns kings into monsters.",
    cast: ["Rodrigo Vane", "Annette Cross", "Søren Dall"]
  },
  {
    id: 4,
    title: "Sunbreak",
    year: 2024,
    rating: 7.5,
    duration: "1h 44m",
    genre: ["Romance", "Drama"],
    emoji: "🌅",
    isNew: true,
    desc: "Two strangers meet on a cross-country train and slowly unravel each other's carefully guarded pasts.",
    cast: ["Mia Fontaine", "Leo Archer"]
  },
  {
    id: 5,
    title: "The Iron Meridian",
    year: 2023,
    rating: 9.0,
    duration: "2h 34m",
    genre: ["Drama", "War"],
    emoji: "🏆",
    isNew: false,
    desc: "An aging war veteran discovers his country's darkest secret buried beneath a mountain — and must choose between loyalty and truth.",
    cast: ["Victor Hale", "Constanze Roth", "Ali Nassir", "Bex Calloway"]
  },
  {
    id: 6,
    title: "Pixel Dreams",
    year: 2024,
    rating: 8.4,
    duration: "1h 38m",
    genre: ["Animation", "Comedy"],
    emoji: "🎮",
    isNew: true,
    desc: "A game character gains sentience and escapes into the real world — only to find reality far less fun than it looked.",
    cast: ["Voiced by: Sam Cho", "Riona Bell"]
  },
  {
    id: 7,
    title: "Arctic Silence",
    year: 2023,
    rating: 7.8,
    duration: "1h 56m",
    genre: ["Thriller", "Drama"],
    emoji: "🧊",
    isNew: false,
    desc: "A polar researcher stationed alone in Greenland begins receiving transmissions from a base that shut down 40 years ago.",
    cast: ["Hanna Bjork", "Nikolai Stern"]
  },
  {
    id: 8,
    title: "Last Metro",
    year: 2022,
    rating: 8.1,
    duration: "2h 00m",
    genre: ["Drama", "Romance"],
    emoji: "🚇",
    isNew: false,
    desc: "In a city on the brink of collapse, a group of strangers share one last night on the underground metro.",
    cast: ["Céline Moreau", "Dante Cruz", "Yuki Abe", "Franz Müller"]
  },
  {
    id: 9,
    title: "Nova Collapse",
    year: 2024,
    rating: 7.6,
    duration: "1h 49m",
    genre: ["Sci-Fi", "Action"],
    emoji: "💥",
    isNew: true,
    desc: "Earth's last defense satellite malfunctions, and only a rogue pilot can stop an asteroid the size of a continent.",
    cast: ["Rayo Diaz", "Priya Nair", "Chuck Wallis"]
  },
  {
    id: 10,
    title: "The Vanishing Act",
    year: 2023,
    rating: 8.3,
    duration: "1h 58m",
    genre: ["Thriller", "Mystery"],
    emoji: "🎩",
    isNew: false,
    desc: "A celebrated illusionist disappears during his greatest performance — and the police can't explain how.",
    cast: ["Alexei Morin", "Serena Vang"]
  },
  {
    id: 11,
    title: "Mango Rain",
    year: 2022,
    rating: 7.7,
    duration: "1h 42m",
    genre: ["Comedy", "Romance"],
    emoji: "🥭",
    isNew: false,
    desc: "A bumbling food blogger accidentally goes viral after reviewing a roadside stand — and falls for the chef.",
    cast: ["Priya Das", "Oliver Kwan"]
  },
  {
    id: 12,
    title: "Ironclad",
    year: 2021,
    rating: 8.5,
    duration: "2h 22m",
    genre: ["Action", "Drama"],
    emoji: "⚔️",
    isNew: false,
    desc: "A legendary swordsmith is forced back into war to forge one last weapon that could save — or doom — his kingdom.",
    cast: ["Masato Hiroshi", "Lena Brandt", "Kwame Osei"]
  }
];

const topPicks = [
  {
    title: "Crimson Divide",
    sub: "Action · 2024",
    emoji: "🔥",
    bg: "linear-gradient(135deg,#3d0000,#1a0a0a)",
    movieIndex: 1
  },
  {
    title: "Pixel Dreams",
    sub: "Animation · 2024",
    emoji: "🎮",
    bg: "linear-gradient(135deg,#001a3d,#0a0a1a)",
    movieIndex: 5
  },
  {
    title: "Arctic Silence",
    sub: "Thriller · 2023",
    emoji: "🧊",
    bg: "linear-gradient(135deg,#001a2e,#0a1520)",
    movieIndex: 6
  },
  {
    title: "Nova Collapse",
    sub: "Sci-Fi · 2024",
    emoji: "💥",
    bg: "linear-gradient(135deg,#1a0033,#0a0015)",
    movieIndex: 8
  }
];

// Poster background colours per card
const cardBgColors = [
  '#1a0a2e', '#0d1b2e', '#1a0a0a',
  '#0a1a0a', '#1a1a0a', '#1a0a1a'
];
