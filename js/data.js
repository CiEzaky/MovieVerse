/* ══════════════════════════════════════
   MovieVerse — data.js
   TMDB API integration with field mapping
   ══════════════════════════════════════ */

const API_KEY = '01c8e1e1519b1ef75d38e910d2d62a0e';
const BASE    = 'https://api.themoviedb.org/3';
const IMG     = 'https://image.tmdb.org/t/p/w500';

/* Genre ID to name mapping (TMDB standard) */
const GENRE_MAP = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western'
};

/* Emoji mapping by genre */
const EMOJI_MAP = {
  'Action': '⚡',
  'Sci-Fi': '🚀',
  'Drama': '🎭',
  'Thriller': '🔪',
  'Comedy': '😂',
  'Horror': '👻',
  'Romance': '💕',
  'Animation': '✨',
  'Adventure': '🗺️',
  'Crime': '🔫',
  'Mystery': '🔍',
  'War': '⚔️',
  'Western': '🤠',
  'Default': '🎬'
};

let movies = [];

/* Helper: Get emoji based on genres */
function getEmoji(genreIds) {
  if (!genreIds || genreIds.length === 0) return EMOJI_MAP['Default'];
  const primaryGenre = GENRE_MAP[genreIds[0]];
  return EMOJI_MAP[primaryGenre] || EMOJI_MAP['Default'];
}

/* Helper: Format runtime */
function formatRuntime(minutes) {
  if (!minutes) return '2h 18m';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

/* Fetch and transform TMDB data */
async function fetchTrending() {
  try {
    const res = await fetch(`${BASE}/trending/movie/week?api_key=${API_KEY}`);
    const data = await res.json();
    
    if (!data.results) {
      console.error('No results from TMDB');
      return [];
    }

    /* Transform TMDB response to card builder format */
    movies = data.results.map((tmdbMovie, index) => ({
      /* Required fields for card builder */
      id: tmdbMovie.id,
      title: tmdbMovie.title || 'Unknown',
      emoji: getEmoji(tmdbMovie.genre_ids),
      rating: (tmdbMovie.vote_average || 0).toFixed(1),
      year: tmdbMovie.release_date ? new Date(tmdbMovie.release_date).getFullYear() : 'N/A',
      duration: '2h 18m', /* Default; runtime requires separate API call */
      genre: (tmdbMovie.genre_ids || []).map(id => GENRE_MAP[id]).filter(Boolean),
      desc: tmdbMovie.overview || 'No description available',
      cast: [], /* Populated by enrichMovieData() */
      isNew: index < 7, /* Mark first 7 as new */
      poster: tmdbMovie.poster_path ? IMG + tmdbMovie.poster_path : null,
      backdrop: tmdbMovie.backdrop_path ? IMG + tmdbMovie.backdrop_path : null
    }));
    
    console.log(`✓ Loaded ${movies.length} movies from TMDB`);
    return movies;
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    return [];
  }
}

/* Fetch runtime and cast for specific movie */
async function enrichMovieData(movieId) {
  try {
    const res = await fetch(`${BASE}/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits`);
    const data = await res.json();
    
    return {
      duration: data.runtime ? formatRuntime(data.runtime) : '2h 18m',
      cast: data.credits?.cast?.slice(0, 5).map(c => c.name) || []
    };
  } catch (error) {
    console.error(`Error enriching movie ${movieId}:`, error);
    return { duration: '2h 18m', cast: [] };
  }
}

/* Enrich first N movies with runtime & cast */
async function enrichMovies(count = 5) {
  for (let i = 0; i < Math.min(count, movies.length); i++) {
    const extra = await enrichMovieData(movies[i].id);
    movies[i].duration = extra.duration;
    movies[i].cast = extra.cast;
  }
}

/* Initialize: Fetch trending movies */
async function initMovies() {
  await fetchTrending();
  /* Enrich top 5 with detailed data (runtime, cast) */
  await enrichMovies(5);
}

/* Load on page ready */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMovies);
} else {
  initMovies();
}

/* Top picks for featured strip */
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

/* Poster background colours per card */
const cardBgColors = [
  '#1a0a2e', '#0d1b2e', '#1a0a0a',
  '#0a1a0a', '#1a1a0a', '#1a0a1a'
];
