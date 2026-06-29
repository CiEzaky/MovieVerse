/* ══════════════════════════════════════
   MovieVerse — app.js  (v3)
   ══════════════════════════════════════ */

/* ── State ── */
let playing = false;
let progressInterval = null;
let currentMovie = null;
let currentQuality = 'Auto';
let qualityPanelOpen = false;

/* Hero slideshow state */
let heroMovies = [];
let heroIndex  = 0;
let heroTimer  = null;

/* ══════════════════════════════════════
   DRAWER (mobile slide-in menu)
   ══════════════════════════════════════ */
function openDrawer() {
  document.getElementById('drawer').classList.add('open');
  document.getElementById('drawerOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  // Update badge in drawer
  const count = typeof getMyList === 'function' ? getMyList().length : 0;
  const badge = document.getElementById('drawerBadge');
  if (badge) {
    badge.textContent = count;
    badge.style.display = count ? 'inline-flex' : 'none';
  }
}

function closeDrawer() {
  document.getElementById('drawer').classList.remove('open');
  document.getElementById('drawerOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

/* ══════════════════════════════════════
   CARD BUILDER
   ══════════════════════════════════════ */
const cardBgColors = ['#1a0a2e','#0d1b2e','#1a0a0a','#0a1a0a','#1a1a0a','#1a0a1a'];

function createCard(movie) {
  const card = document.createElement('div');
  card.className = 'movie-card';

  const posterStyle = movie.poster
    ? `background: url('${movie.poster}') center/cover;`
    : `background: ${cardBgColors[movie.id % cardBgColors.length]};`;

  card.innerHTML = `
    <div class="movie-poster" style="${posterStyle}">
      ${!movie.poster ? `<span>${movie.emoji}</span>` : ''}
      ${movie.isNew ? '<span class="badge-new">NEW</span>' : ''}
      <span class="badge-hd">HD</span>
      <div class="card-overlay"><div class="play-btn">▶</div></div>
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
   HERO SLIDESHOW
   ══════════════════════════════════════ */
function initHero(movieList) {
  heroMovies = movieList.slice(0, 8);
  heroIndex = 0;
  const slidesEl = document.getElementById('heroSlides');
  const dotsEl   = document.getElementById('heroDots');
  if (!slidesEl || !dotsEl) return;

  slidesEl.innerHTML = '';
  dotsEl.innerHTML   = '';

  heroMovies.forEach((m, i) => {
    const slide = document.createElement('div');
    slide.className = 'hero-slide' + (i === 0 ? ' active' : '');
    if (m.backdrop || m.poster) slide.style.backgroundImage = `url('${m.backdrop || m.poster}')`;
    slidesEl.appendChild(slide);

    const dot = document.createElement('button');
    dot.className = 'hero-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Slide ${i+1}`);
    dot.addEventListener('click', () => { clearTimeout(heroTimer); goToSlide(i); startHeroAutoplay(); });
    dotsEl.appendChild(dot);
  });

  renderHeroContent(0);
  startHeroAutoplay();

  document.getElementById('heroPrev')?.addEventListener('click', () => stepHero(-1));
  document.getElementById('heroNext')?.addEventListener('click', () => stepHero(1));

  // Touch swipe on hero
  let tx = 0;
  const heroEl = document.getElementById('hero');
  heroEl?.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  heroEl?.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 40) stepHero(dx < 0 ? 1 : -1);
  });
}

function renderHeroContent(index) {
  const m = heroMovies[index];
  if (!m) return;
  const titleEl = document.getElementById('heroTitle');
  const metaEl  = document.getElementById('heroMeta');
  const descEl  = document.getElementById('heroDesc');
  const watchBtn = document.getElementById('heroWatchBtn');
  const infoBtn  = document.getElementById('heroInfoBtn');
  if (titleEl) titleEl.textContent = m.title;
  if (metaEl) metaEl.innerHTML = `
    <span class="hero-rating">★ ${m.rating}</span>
    <span>${m.year}</span>
    <span>${m.duration}</span>
    <span>${(m.genre||[]).slice(0,2).join(' · ')}</span>`;
  if (descEl) descEl.textContent = (m.desc||'').slice(0, 200) + ((m.desc||'').length > 200 ? '…' : '');
  if (watchBtn) watchBtn.onclick = () => openModal(m);
  if (infoBtn)  infoBtn.onclick  = () => openModal(m);
}

function goToSlide(index) {
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-dot');
  slides[heroIndex]?.classList.remove('active');
  dots[heroIndex]?.classList.remove('active');
  heroIndex = (index + heroMovies.length) % heroMovies.length;
  slides[heroIndex]?.classList.add('active');
  dots[heroIndex]?.classList.add('active');
  renderHeroContent(heroIndex);
}

function stepHero(dir) {
  clearTimeout(heroTimer);
  goToSlide(heroIndex + dir);
  startHeroAutoplay();
}

function startHeroAutoplay() {
  clearTimeout(heroTimer);
  heroTimer = setTimeout(() => { goToSlide(heroIndex + 1); startHeroAutoplay(); }, 6000);
}

/* ══════════════════════════════════════
   FEATURED BANNER
   ══════════════════════════════════════ */
function renderFeaturedBanner(movie) {
  const thumbEl  = document.getElementById('featuredThumb');
  const titleEl  = document.getElementById('featuredTitle');
  const descEl   = document.getElementById('featuredDesc');
  const tagsEl   = document.getElementById('featuredTags');
  const watchBtn = document.getElementById('featuredWatchBtn');
  if (!thumbEl) return;
  if (movie.poster) {
    thumbEl.style.backgroundImage = `url('${movie.poster}')`;
    thumbEl.style.backgroundSize  = 'cover';
    thumbEl.style.backgroundPosition = 'center';
    thumbEl.innerHTML = '';
  }
  if (titleEl) titleEl.textContent = movie.title;
  if (descEl)  descEl.textContent  = (movie.desc||'').slice(0,180) + ((movie.desc||'').length>180?'…':'');
  if (tagsEl)  tagsEl.innerHTML    = (movie.genre||[]).map(g=>`<span class="tag">${g}</span>`).join('');
  if (watchBtn) watchBtn.onclick   = () => openModal(movie);
}

/* ══════════════════════════════════════
   BUILD ROWS (Home page)
   ══════════════════════════════════════ */
function buildRows() {
  if (!window.movies || !movies.length) return;

  initHero(movies);

  const featured = movies.slice(3,10).find(m => parseFloat(m.rating) >= 7) || movies[4];
  if (featured) renderFeaturedBanner(featured);

  const trendingRow = document.getElementById('trendingRow');
  if (trendingRow) { trendingRow.innerHTML=''; movies.slice(0,8).forEach(m=>trendingRow.appendChild(createCard(m))); }

  const newGrid = document.getElementById('newGrid');
  if (newGrid) { newGrid.innerHTML=''; movies.filter(m=>m.isNew).forEach(m=>newGrid.appendChild(createCard(m))); }

  const classicsRow = document.getElementById('classicsRow');
  if (classicsRow) { classicsRow.innerHTML=''; movies.filter(m=>!m.isNew).slice(0,10).forEach(m=>classicsRow.appendChild(createCard(m))); }

  const strip = document.getElementById('topStrip');
  if (strip) {
    strip.innerHTML='';
    movies.slice(8,14).forEach(m => {
      const item = document.createElement('div');
      item.className = 'top-item';
      if (m.backdrop||m.poster) { item.style.backgroundImage=`url('${m.backdrop||m.poster}')`; item.style.backgroundSize='cover'; item.style.backgroundPosition='center'; }
      else item.style.background='#1a0a2e';
      item.innerHTML=`<div class="top-item-overlay"><h3>${m.title}</h3><p>${(m.genre||[]).slice(0,2).join(' · ')} · ${m.year}</p></div>`;
      item.addEventListener('click', ()=>openModal(m));
      strip.appendChild(item);
    });
  }
}

/* ══════════════════════════════════════
   VIDEO QUALITY
   ══════════════════════════════════════ */
function toggleQualityPanel() {
  qualityPanelOpen = !qualityPanelOpen;
  const panel = document.getElementById('qualityPanel');
  if (panel) panel.classList.toggle('open', qualityPanelOpen);
}

function setQuality(q) {
  currentQuality = q;
  // Update indicator badge
  const indicator = document.getElementById('qualityIndicator');
  if (indicator) indicator.textContent = q.toUpperCase();
  // Mark active button
  document.querySelectorAll('.quality-opt').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.q === q);
  });
  // Show toast
  showToast(`Quality set to ${q}`);
  // Close panel
  qualityPanelOpen = false;
  document.getElementById('qualityPanel')?.classList.remove('open');
}

/* ══════════════════════════════════════
   MODAL
   ══════════════════════════════════════ */
function openModal(movie) {
  currentMovie = movie;
  document.getElementById('modalTitle').textContent = movie.title;
  document.getElementById('modalEmoji').textContent = movie.emoji || '🎬';
  document.getElementById('modalDesc').textContent  = movie.desc || '';

  const modalVideoBg = document.getElementById('modalVideo');
  if (movie.backdrop || movie.poster) {
    modalVideoBg.style.backgroundImage = `url('${movie.backdrop || movie.poster}')`;
    modalVideoBg.style.backgroundSize  = 'cover';
    modalVideoBg.style.backgroundPosition = 'center';
  } else {
    modalVideoBg.style.backgroundImage = '';
    modalVideoBg.style.background = 'linear-gradient(135deg,#1a1a4e,#2d1b69)';
  }

  document.getElementById('modalMeta').innerHTML = `
    <span class="rating">★ ${movie.rating}</span>
    <span>${movie.year}</span>
    <span>${movie.duration}</span>
    ${(movie.genre||[]).map(g=>`<span>${g}</span>`).join('')}`;

  const castList = document.getElementById('castList');
  castList.innerHTML = movie.cast && movie.cast.length
    ? movie.cast.map(c=>`<span class="cast-chip">${c}</span>`).join('')
    : '<span class="cast-chip" style="opacity:.4">Loading cast…</span>';

  const relRow = document.getElementById('relatedRow');
  relRow.innerHTML = '';
  const allM = window.movies || [];
  allM.filter(m=>m.id!==movie.id&&(m.genre||[]).some(g=>(movie.genre||[]).includes(g))).slice(0,5).forEach(r=>{
    const rc = document.createElement('div');
    rc.className='related-card';
    rc.innerHTML=`<div class="related-thumb" style="${r.poster?`background:url('${r.poster}') center/cover`:'background:#1a1a2e'}">${!r.poster?r.emoji:''}</div><p>${r.title}</p>`;
    rc.addEventListener('click',()=>openModal(r));
    relRow.appendChild(rc);
  });

  updateListBtn();
  // Reset quality panel state
  qualityPanelOpen = false;
  document.getElementById('qualityPanel')?.classList.remove('open');
  // Restore quality indicator
  const indicator = document.getElementById('qualityIndicator');
  if (indicator) indicator.textContent = currentQuality.toUpperCase();
  document.querySelectorAll('.quality-opt').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.q === currentQuality);
  });

  resetPlayer(movie.duration);
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function updateListBtn() {
  const btn = document.getElementById('listBtn');
  if (!btn || !currentMovie) return;
  const inList = typeof isInMyList === 'function' && isInMyList(currentMovie.id);
  btn.textContent = inList ? '♥' : '♡';
  btn.title = inList ? 'Remove from My List' : 'Add to My List';
  btn.style.color = inList ? 'var(--accent)' : '';
}

function addToMyList() {
  if (!currentMovie || typeof toggleMyList !== 'function') return;
  const added = toggleMyList(currentMovie);
  updateListBtn();
  if (typeof updateMyListBadge === 'function') updateMyListBadge();
  showToast(added ? `Added "${currentMovie.title}" to My List` : 'Removed from My List');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
  clearInterval(progressInterval);
  playing = false;
  document.getElementById('playBtn').textContent = '▶';
  document.getElementById('qualityPanel')?.classList.remove('open');
  qualityPanelOpen = false;
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
  document.getElementById('timeDisplay').textContent  = `0:00 / ${duration || '2:00:00'}`;
  document.getElementById('playBtn').textContent = '▶';
}

function togglePlay() {
  playing = !playing;
  document.getElementById('playBtn').textContent = playing ? '⏸' : '▶';
  if (playing) {
    progressInterval = setInterval(() => {
      const fill = document.getElementById('progressFill');
      const cur  = parseFloat(fill.style.width) || 3;
      if (cur >= 100) { clearInterval(progressInterval); playing = false; document.getElementById('playBtn').textContent='▶'; return; }
      const next = Math.min(cur + 0.08, 100);
      fill.style.width = next + '%';
      const totalSecs = 138 * 60;
      const elapsed   = Math.floor((next/100)*totalSecs);
      document.getElementById('timeDisplay').textContent = `${Math.floor(elapsed/60)}:${(elapsed%60).toString().padStart(2,'0')} / 2:18:00`;
    }, 100);
  } else {
    clearInterval(progressInterval);
  }
}

function scrubProgress(e) {
  const pct = (e.offsetX / e.currentTarget.offsetWidth) * 100;
  document.getElementById('progressFill').style.width = Math.max(0,Math.min(100,pct)) + '%';
}

/* ══════════════════════════════════════
   GENRE FILTER (Home page)
   ══════════════════════════════════════ */
function filterGenre(genre, el) {
  document.querySelectorAll('.pill').forEach(p=>p.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.movie-card').forEach(card => {
    if (genre==='All') { card.style.opacity='1'; card.style.pointerEvents=''; return; }
    const t = card.querySelector('.movie-title');
    if (!t) return;
    const movie = (window.movies||[]).find(m=>m.title===t.textContent);
    const match = movie && (movie.genre||[]).includes(genre);
    card.style.opacity = match ? '1' : '0.2';
    card.style.pointerEvents = match ? '' : 'none';
  });
}

/* ══════════════════════════════════════
   TOAST
   ══════════════════════════════════════ */
function showToast(msg) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => { toast.classList.remove('show'); setTimeout(()=>toast.remove(),300); }, 2200);
}

/* ══════════════════════════════════════
   SEARCH (Home page)
   ══════════════════════════════════════ */
const searchEl = document.getElementById('searchInput');
if (searchEl && document.querySelector('[data-page="home"]')) {
  searchEl.addEventListener('input', function() {
    const q = this.value.toLowerCase().trim();
    document.querySelectorAll('.movie-card').forEach(card => {
      const t = card.querySelector('.movie-title');
      card.style.opacity = (!q||t?.textContent.toLowerCase().includes(q)) ? '1' : '0.15';
    });
  });
}

/* ══════════════════════════════════════
   KEYBOARD
   ══════════════════════════════════════ */
document.addEventListener('keydown', e => {
  if (e.key==='Escape') { closeModal(); closeDrawer(); }
  if (e.key===' ' && document.getElementById('modalOverlay')?.classList.contains('open')) {
    e.preventDefault(); togglePlay();
  }
});
