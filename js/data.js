/* ══════════════════════════════════════
   MovieVerse — data.js
   Replace with TMDB API calls for real data
   ══════════════════════════════════════ */
const API_KEY = '01c8e1e1519b1ef75d38e910d2d62a0e';
const BASE    = 'https://api.themoviedb.org/3';
const IMG     = 'https://image.tmdb.org/t/p/w500';

async function fetchTrending() {
  const res  = await fetch(`${BASE}/trending/movie/week?api_key=${API_KEY}`);
  const data = await res.json();
  return data.results;
}

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
