# 🎬 MovieVerse

A dark cinematic movie website with browsing + streaming UI.
Built with plain HTML, CSS, and JavaScript — no frameworks needed.

---

## 📁 File Structure

```
movieverse/
├── index.html          ← Main page (open this in your browser)
├── css/
│   └── style.css       ← All styles
├── js/
│   ├── data.js         ← Movie data (replace with TMDB API)
│   └── app.js          ← All interactivity
└── README.md           ← This file
```

---

## 🚀 How to Run

1. Unzip the downloaded folder
2. Open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari)
3. That's it — no server or install needed!

---

## ✨ Features

- Hero section with Watch + Info buttons
- Editor's Pick featured banner
- Trending, New Releases, Classics rows
- Top Picks visual strip
- Genre filter pills (live filtering)
- Search bar (live search)
- Movie modal with:
  - Mock video player (Play/Pause, scrub, timer)
  - Cast list
  - Related movies
- Keyboard shortcuts: `Esc` to close modal, `Space` to play/pause

---

## 🔑 Connect Real Movie Data (TMDB API)

1. Get a free API key at https://www.themoviedb.org/
2. Open `js/data.js`
3. Replace the `movies` array with a fetch call like:

```js
const API_KEY = 'YOUR_KEY_HERE';
const BASE    = 'https://api.themoviedb.org/3';
const IMG     = 'https://image.tmdb.org/t/p/w500';

async function fetchTrending() {
  const res  = await fetch(`${BASE}/trending/movie/week?api_key=${API_KEY}`);
  const data = await res.json();
  return data.results;
}
```

4. Map TMDB fields to the card builder in `js/app.js`

---

## 🎨 Customisation

| What              | Where                        |
|-------------------|------------------------------|
| Colours / theme   | `css/style.css` → `:root`    |
| Movie data        | `js/data.js`                 |
| Site name / logo  | `index.html` → `.logo`       |
| Hero movie        | `index.html` → `.hero`       |
| Featured banner   | `index.html` → `.featured-banner` |

---

Made with ❤️ by MovieVerse
