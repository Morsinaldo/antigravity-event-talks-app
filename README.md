# BigQuery Release Notes Hub & Twitter Composer

A high-fidelity dashboard built with **Python Flask** and **plain vanilla HTML, CSS, and JavaScript**. It retrieves Google Cloud's official BigQuery Release Notes feed, structures the entries into interactive standalone cards, and enables one-click sharing to Twitter / X via a composer with live post previews.

---

## ✨ Features

- **Granular Update Parsing:** Automatically decomposes bulk daily updates into individual, color-coded cards corresponding to their category (Features, Issues, Deprecations, and Fixes).
- **Server-Side Cache:** Implements a 5-minute caching mechanism for the XML feed to guarantee high speeds and avoid rate-limiting.
- **Dynamic Timeline Filters:** Supports instant client-side searching and category pill filtering (e.g. view only Features or Issues).
- **Interactive Composer:** Select any card to immediately populate the Twitter/X Composer with custom text. Offers character limit warnings and tag helpers.
- **Live Mock Post Preview:** Provides a live card that replicates the look of an actual X post, complete with blue highlighted hashtags/links, verification badges, and automatic timestamps.
- **Vanilla Design Tokens:** Dark-themed responsive layout with smooth CSS transitions, animations, and vector graphics (`static/bq-logo.svg`).

---

## 📂 File Directory

- **[`app.py`](file:///Users/morsinaldo/agy2-projects/agy-cli-projects/app.py):** Main Flask application server handling caching, routing, XML feed reading, and BS4 CDATA content split-parsing.
- **[`templates/index.html`](file:///Users/morsinaldo/agy2-projects/agy-cli-projects/templates/index.html):** Core HTML5 layout with sidebar, toolbar, timeline, and composer components.
- **[`static/style.css`](file:///Users/morsinaldo/agy2-projects/agy-cli-projects/static/style.css):** Premium responsive stylesheet containing colors, variables, animations, and elements styling.
- **[`static/app.js`](file:///Users/morsinaldo/agy2-projects/agy-cli-projects/static/app.js):** Client-side ES6 state coordination, SVG character ring offset calculations, filters, and intent triggers.
- **[`static/bq-logo.svg`](file:///Users/morsinaldo/agy2-projects/agy-cli-projects/static/bq-logo.svg):** Custom vector branding logo.
- **[`requirements.txt`](file:///Users/morsinaldo/agy2-projects/agy-cli-projects/requirements.txt):** Core dependencies (Flask, requests, and beautifulsoup4).
- **[`.gitignore`](file:///Users/morsinaldo/agy2-projects/agy-cli-projects/.gitignore):** Python/Flask environment ignores.

---

## 🚀 Getting Started

### Prerequisites
Make sure you have **Python 3.8+** installed.

### Setup and Running Instructions

1. **Activate the Virtual Environment:**
   ```bash
   source .venv/bin/activate
   ```

2. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Start the Flask Server:**
   ```bash
   python app.py
   ```
   *Note: The app is configured to serve on port `5001` to prevent conflicts with default macOS system settings.*

4. **Open in Browser:**
   Navigate to **`http://127.0.0.1:5001`**.

---

## 📤 Pushing Changes to GitHub

If you make modifications and want to push your local commits to GitHub:

1. **Stage and Commit:**
   ```bash
   git add .
   git commit -m "Your commit message description"
   ```

2. **Push to Main Branch:**
   ```bash
   git push origin main
   ```
