/* ══════════════════════════════════════
   MovieVerse — app.js
   ══════════════════════════════════════ */

/* ── State ── */
let playing = false;
let progressInterval = null;

/* ══════════════════════════════════════
   CARD BUILDER
   TMDB Field Mapping:
   - movie.id        ← TMDB: id
   - movie.title     ← TMDB: title
   - movie.emoji     ← TMDB: genre_ids (auto-mapped to emoji)
   - movie.rating    ← TMDB: vote_average
   - movie.year      ← TMDB: release_date
   - movie.duration  ← TMDB: runtime (formatted as "Xh Ym")
   - movie.genre     ← TMDB: genre_ids (mapped to genre names)
   - movie.desc      ← TMDB: overview
   - movie.cast      ← TMDB: credits.cast
   - movie.isNew     ← Custom flag (first 7 trending)
   ══════════════════════��═══════════════ */
function createCard(movie) {
  const card = document.createElement('div');
  card.className = 'movie-card';

  /* Use movie.id to cycle through background colors */
  const bg = cardBgColors[movie.id % cardBgColors.length];

  card.innerHTML = `
    <div class="movie-poster" style="background:${bg}">
      <span>${movie.emoji}</span>
      ${movie.isNew ? '<span class="badge-new">NEW</span>' : ''}
      <span class="badge-hd">HD</span>
      <div class="card-overlay">
        <div class="play-btn">▶</div>
      </div>
    </div>
    <div class="movie-info">
      <div class="movie-title">${movie.title}</div>
      <div class="movie-sub">
        <span class="star">★ ${movie.rating}</span>
        <span>${movie.year}</span>
        <span>${movie.duration}</span>
      </div>
    </div>`;

  card.addEventListener('click', () => openModal(movie));
  return card;
}

/* ══════════════════════════════════════
   BUILD ALL ROWS ON LOAD
   Populates sections from the movies array
   ══════════════════════════════════════ */
function buildRows() {
  // Trending — first 7 movies
  const trendingRow = document.getElementById('trendingRow');
  movies.slice(0, 7).forEach(m => trendingRow.appendChild(createCard(m)));

  // New Releases — movies marked as isNew
  const newGrid = document.getElementById('newGrid');
  movies.filter(m => m.isNew).forEach(m => newGrid.appendChild(createCard(m)));

  // Classics — movies NOT marked as new
  const classicsRow = document.getElementById('classicsRow');
  movies.filter(m => !m.isNew).forEach(m => classicsRow.appendChild(createCard(m)));

  // Top Picks strip — static content from topPicks array
  const strip = document.getElementById('topStrip');
  topPicks.forEach(p => {
    const item = document.createElement('div');
    item.className = 'top-item';
    item.style.background = p.bg;
    item.innerHTML = `
      <div class="top-item-bg">${p.emoji}</div>
      <div class="top-item-overlay">
        <h3>${p.title}</h3>
        <p>${p.sub}</p>
      </div>`;
    item.addEventListener('click', () => openModal(movies[p.movieIndex]));
    strip.appendChild(item);
  });
}

/* ══════════════════════════════════════
   MODAL
   TMDB Field Mapping in Detail:
   
   Title:
   - movie.title ← TMDB: title
   
   Rating & Meta:
   - movie.rating ← TMDB: vote_average (e.g., "8.7")
   - movie.year ← TMDB: release_date (extracted as YYYY)
   - movie.duration ← TMDB: runtime (formatted "Xh Ym")
   - movie.genre ← TMDB: genre_ids → mapped to genre names
   
   Description:
   - movie.desc ← TMDB: overview
   
   Cast:
   - movie.cast ← TMDB: credits.cast (array of actor names)
   
   Related Movies:
   - Filters by matching genre
   ══════════════════════════════════════ */
function openModal(movie) {
  // Populate modal title from TMDB title field
  document.getElementById('modalTitle').textContent  = movie.title;
  
  // Populate emoji from auto-generated genre emoji
  document.getElementById('modalEmoji').textContent  = movie.emoji;
  
  // Populate description from TMDB overview
  document.getElementById('modalDesc').textContent   = movie.desc;

  /* Meta information: rating, year, duration, genres */
  document.getElementById('modalMeta').innerHTML = `
    <span class="rating">★ ${movie.rating}</span>
    <span>${movie.year}</span>
    <span>${movie.duration}</span>
    ${movie.genre.map(g => `<span>${g}</span>`).join('')}`;

  /* Cast list from TMDB credits */
  const castList = document.getElementById('castList');
  castList.innerHTML = movie.cast
    .map(c => `<span class="cast-chip">${c}</span>`)
    .join('');

  /* Related movies: find others with matching genre */
  const related = movies
    .filter(m => m.id !== movie.id && m.genre.some(g => movie.genre.includes(g)))
    .slice(0, 5);

  /* Build related cards */
  const relRow = document.getElementById('relatedRow');
  relRow.innerHTML = '';
  related.forEach(r => {
    const rc = document.createElement('div');
    rc.className = 'related-card';
    rc.innerHTML = `
      <div class="related-thumb" style="background:#1a1a2e">${r.emoji}</div>
      <p>${r.title}</p>`;
    rc.addEventListener('click', () => openModal(r));
    relRow.appendChild(rc);
  });

  // Reset player with movie duration from TMDB runtime
  resetPlayer(movie.duration);

  // Show overlay
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
  clearInterval(progressInterval);
  playing = false;
  document.getElementById('playBtn').textContent = '▶';
}

function handleOverlayClick(e) {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
}

/* ══════════════════════════════════════
   VIDEO PLAYER (mock)
   Uses movie.duration from TMDB runtime
   ══════════════════════════════════════ */
function resetPlayer(duration) {
  clearInterval(progressInterval);
  playing = false;
  document.getElementById('progressFill').style.width = '3%';
  document.getElementById('timeDisplay').textContent  = `0:00 / ${duration}`;
  document.getElementById('playBtn').textContent       = '▶';
}

function togglePlay() {
  playing = !playing;
  document.getElementById('playBtn').textContent = playing ? '⏸' : '▶';

  if (playing) {
    progressInterval = setInterval(() => {
      const fill    = document.getElementById('progressFill');
      const current = parseFloat(fill.style.width) || 3;

      if (current >= 100) {
        clearInterval(progressInterval);
        playing = false;
        document.getElementById('playBtn').textContent = '▶';
        return;
      }

      const next = Math.min(current + 0.08, 100);
      fill.style.width = next + '%';

      // Update time display
      const totalSecs = 138 * 60; // 2h 18m default
      const elapsed   = Math.floor((next / 100) * totalSecs);
      const mins      = Math.floor(elapsed / 60);
      const secs      = elapsed % 60;
      document.getElementById('timeDisplay').textContent =
        `${mins}:${secs.toString().padStart(2, '0')} / 2:18:00`;

    }, 100);
  } else {
    clearInterval(progressInterval);
  }
}

function scrubProgress(e) {
  const bar = e.currentTarget;
  const pct = (e.offsetX / bar.offsetWidth) * 100;
  document.getElementById('progressFill').style.width = Math.max(0, Math.min(100, pct)) + '%';
}

/* ══════════════════════════════════════
   GENRE FILTER
   Uses movie.genre array from TMDB genre_ids
   ══════════════════════════════════════ */
function filterGenre(genre, el) {
  // Update active pill
  document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');

  // Dim/show cards based on movie.genre matching selected genre
  document.querySelectorAll('.movie-card').forEach(card => {
    if (genre === 'All') {
      card.style.opacity        = '1';
      card.style.pointerEvents  = '';
      return;
    }
    const titleEl = card.querySelector('.movie-title');
    if (!titleEl) return;
    const movie = movies.find(m => m.title === titleEl.textContent);
    const match = movie && movie.genre.includes(genre);
    card.style.opacity       = match ? '1' : '0.2';
    card.style.pointerEvents = match ? '' : 'none';
  });
}

/* ══════════════════════════════════════
   SEARCH
   Searches in movie.title from TMDB title field
   ══════════════════════════════════════ */
document.getElementById('searchInput').addEventListener('input', function () {
  const query = this.value.toLowerCase().trim();

  document.querySelectorAll('.movie-card').forEach(card => {
    const titleEl = card.querySelector('.movie-title');
    if (!titleEl) return;
    const title = titleEl.textContent.toLowerCase();
    card.style.opacity = (!query || title.includes(query)) ? '1' : '0.15';
  });
});

/* ══════════════════════════════════════
   KEYBOARD SHORTCUTS
   ══════════════════════════════════════ */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
  if (e.key === ' ' && document.getElementById('modalOverlay').classList.contains('open')) {
    e.preventDefault();
    togglePlay();
  }
});

/* ══════════════════════════════════════
   INIT
   Waits for data.js to load movies array,
   then builds all rows from TMDB data
   ══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', buildRows);
