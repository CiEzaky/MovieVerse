/* ══════════════════════════════════════
   MovieVerse — data.js  (v2)
   TMDB API integration
   ══════════════════════════════════════ */

const API_KEY = '01c8e1e1519b1ef75d38e910d2d62a0e';
const BASE    = 'https://api.themoviedb.org/3';
const IMG     = 'https://image.tmdb.org/t/p/w500';
const IMG_BIG = 'https://image.tmdb.org/t/p/w1280';

const GENRE_MAP = {
  28:'Action', 12:'Adventure', 16:'Animation', 35:'Comedy', 80:'Crime',
  99:'Documentary', 18:'Drama', 10751:'Family', 14:'Fantasy', 36:'History',
  27:'Horror', 10402:'Music', 9648:'Mystery', 10749:'Romance',
  878:'Science Fiction', 10770:'TV Movie', 53:'Thriller', 10752:'War', 37:'Western'
};

const EMOJI_MAP = {
  'Action':'⚡','Science Fiction':'🚀','Drama':'🎭','Thriller':'🔪','Comedy':'😂',
  'Horror':'👻','Romance':'💕','Animation':'✨','Adventure':'🗺️','Crime':'🔫',
  'Mystery':'🔍','War':'⚔️','Western':'🤠','Default':'🎬'
};

let movies = [];

function getEmoji(genreIds) {
  if (!genreIds?.length) return '🎬';
  return EMOJI_MAP[GENRE_MAP[genreIds[0]]] || '🎬';
}

function formatRuntime(minutes) {
  if (!minutes) return '2h 0m';
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

/* Transform raw TMDB result → app movie object */
function mapMovie(tmdbMovie, index) {
  return {
    id: tmdbMovie.id,
    title: tmdbMovie.title || 'Unknown',
    emoji: getEmoji(tmdbMovie.genre_ids),
    rating: (tmdbMovie.vote_average || 0).toFixed(1),
    year: tmdbMovie.release_date ? new Date(tmdbMovie.release_date).getFullYear() : 'N/A',
    duration: '2h 0m',
    genre: (tmdbMovie.genre_ids || []).map(id => GENRE_MAP[id]).filter(Boolean),
    desc: tmdbMovie.overview || '',
    cast: [],
    isNew: index < 7,
    poster:   tmdbMovie.poster_path   ? IMG     + tmdbMovie.poster_path   : null,
    backdrop: tmdbMovie.backdrop_path ? IMG_BIG + tmdbMovie.backdrop_path : null
  };
}

async function fetchTrending() {
  try {
    const res  = await fetch(`${BASE}/trending/movie/week?api_key=${API_KEY}`);
    const data = await res.json();
    if (!data.results) throw new Error('No results');
    movies = data.results.map(mapMovie);
    window.movies = movies;
    return movies;
  } catch (e) {
    console.error('❌ fetchTrending:', e);
    return [];
  }
}

async function enrichMovieData(movieId) {
  try {
    const res  = await fetch(`${BASE}/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits`);
    const data = await res.json();
    return {
      duration: formatRuntime(data.runtime),
      cast: data.credits?.cast?.slice(0, 5).map(c => c.name) || []
    };
  } catch {
    return { duration: '2h 0m', cast: [] };
  }
}

async function enrichMovies(count = 6) {
  for (let i = 0; i < Math.min(count, movies.length); i++) {
    const extra = await enrichMovieData(movies[i].id);
    movies[i].duration = extra.duration;
    movies[i].cast     = extra.cast;
    if (window.movies) window.movies[i] = movies[i];
  }
}

async function initMovies() {
  await fetchTrending();

  /* Build rows immediately with partial data (posters available) */
  if (typeof buildRows === 'function') buildRows();

  /* Then enrich top 6 with runtime + cast in background */
  await enrichMovies(6);

  /* Re-render hero content with enriched data (durations etc.) */
  if (typeof renderHeroContent === 'function') renderHeroContent(0);
}

/* Start */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMovies);
} else {
  initMovies();
}
