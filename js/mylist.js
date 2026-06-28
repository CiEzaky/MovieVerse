/* ══════════════════════════════════════
   MovieVerse — mylist.js
   Shared My List manager (localStorage)
   ══════════════════════════════════════ */

const MY_LIST_KEY = 'movieverse_mylist';

function getMyList() {
  try {
    return JSON.parse(localStorage.getItem(MY_LIST_KEY)) || [];
  } catch { return []; }
}

function saveMyList(list) {
  localStorage.setItem(MY_LIST_KEY, JSON.stringify(list));
}

function isInMyList(movieId) {
  return getMyList().some(m => m.id === movieId);
}

function addToMyListData(movie) {
  const list = getMyList();
  if (!list.some(m => m.id === movie.id)) {
    list.unshift(movie);
    saveMyList(list);
    return true; // added
  }
  return false; // already there
}

function removeFromMyList(movieId) {
  const list = getMyList().filter(m => m.id !== movieId);
  saveMyList(list);
}

function toggleMyList(movie) {
  if (isInMyList(movie.id)) {
    removeFromMyList(movie.id);
    return false;
  } else {
    addToMyListData(movie);
    return true;
  }
}

/* Nav badge: show count on My List link */
function updateMyListBadge() {
  const count = getMyList().length;
  const listLinks = document.querySelectorAll('a[data-page="mylist"], a[href*="mylist"]');
  listLinks.forEach(link => {
    // Remove old badge
    const old = link.querySelector('.list-badge');
    if (old) old.remove();
    if (count > 0) {
      const badge = document.createElement('sup');
      badge.className = 'list-badge';
      badge.textContent = count;
      link.appendChild(badge);
    }
  });
}

document.addEventListener('DOMContentLoaded', updateMyListBadge);
