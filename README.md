# Pigeon Washers Website

## Files
- `index.html` — the full website (self-contained, all images embedded)
- `update_dates.py` — script that refreshes the 14-day availability cards
- `.github/workflows/refresh-dates.yml` — runs the script automatically every Monday

---

## First-time GitHub Pages setup (do this once)

### 1. Create a GitHub account
Go to https://github.com and sign up if you haven't already.

### 2. Create a new repository
- Click the **+** button → **New repository**
- Name it: `pigeon-washers` (or anything you like)
- Set it to **Public**
- Click **Create repository**

### 3. Upload the files
- Click **uploading an existing file**
- Drag in ALL files from this folder:
  - `index.html`
  - `update_dates.py`
  - `.github/workflows/refresh-dates.yml`  ← make sure this folder structure is kept
- Click **Commit changes**

### 4. Enable GitHub Pages
- Go to your repo → **Settings** → **Pages**
- Under **Source**, select **GitHub Actions**
- Click **Save**

### 5. Enable the workflow
- Go to the **Actions** tab in your repo
- Click **"I understand my workflows, go ahead and enable them"**
- Your site will deploy automatically

### 6. Find your live URL
Your site will be live at:
`https://YOUR-GITHUB-USERNAME.github.io/pigeon-washers/`

---

## Keeping dates current (automatic)
The GitHub Action runs every Monday at 2am NZT and:
1. Regenerates the 14-day availability window
2. Commits the updated `index.html`
3. Redeploys to GitHub Pages

You can also trigger it manually anytime:
- Go to **Actions** → **Refresh availability dates** → **Run workflow**

---

## Updating booked dates (Google Calendar)
Once you have your Google API Key and Calendar ID, open `index.html` in any
text editor and find these two lines near the bottom:

```
const GOOGLE_API_KEY     = 'YOUR_API_KEY_HERE';
const GOOGLE_CALENDAR_ID = 'YOUR_CALENDAR_ID_HERE@group.calendar.google.com';
```

Replace with your real values, save, and re-upload `index.html` to GitHub.
From then on, booked days will turn red automatically based on your Google Calendar.
