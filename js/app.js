/* ══════════════════════════════════════
   MovieVerse — app.js
   ══════════════════════════════════════ */

/* ── State ── */
let playing = false;
let progressInterval = null;

/* ══════════════════════════════════════
   CARD BUILDER
   ══════════════════════════════════════ */
function createCard(movie) {
  const card = document.createElement('div');
  card.className = 'movie-card';

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
   ══════════════════════════════════════ */
function buildRows() {
  // Trending — first 7
  const trendingRow = document.getElementById('trendingRow');
  movies.slice(0, 7).forEach(m => trendingRow.appendChild(createCard(m)));

  // New Releases
  const newGrid = document.getElementById('newGrid');
  movies.filter(m => m.isNew).forEach(m => newGrid.appendChild(createCard(m)));

  // Classics
  const classicsRow = document.getElementById('classicsRow');
  movies.filter(m => !m.isNew).forEach(m => classicsRow.appendChild(createCard(m)));

  // Top Picks strip
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
   ══════════════════════════════════════ */
function openModal(movie) {
  // Populate details
  document.getElementById('modalTitle').textContent  = movie.title;
  document.getElementById('modalEmoji').textContent  = movie.emoji;
  document.getElementById('modalDesc').textContent   = movie.desc;

  document.getElementById('modalMeta').innerHTML = `
    <span class="rating">★ ${movie.rating}</span>
    <span>${movie.year}</span>
    <span>${movie.duration}</span>
    ${movie.genre.map(g => `<span>${g}</span>`).join('')}`;

  // Cast
  const castList = document.getElementById('castList');
  castList.innerHTML = movie.cast
    .map(c => `<span class="cast-chip">${c}</span>`)
    .join('');

  // Related movies (same genre, different film)
  const related = movies
    .filter(m => m.id !== movie.id && m.genre.some(g => movie.genre.includes(g)))
    .slice(0, 5);

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

  // Reset player
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
   ══════════════════════════════════════ */
function filterGenre(genre, el) {
  // Update active pill
  document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');

  // Dim/show cards
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
   ══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', buildRows);
