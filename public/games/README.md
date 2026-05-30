# Adding games (no code changes needed)

1. Drop the game's HTML file into `public/games/` (e.g. `my-game.html`).
2. Drop the thumbnail into `public/games/thumbs/` (e.g. `my-game.png`).
3. Open `public/games/manifest.json` and add an entry:

```json
{
  "name": "My Game",
  "url": "/games/my-game.html",
  "img": "/games/thumbs/my-game.png",
  "genre": "Arcade",
  "device": "mobile+pc",
  "added": "2026-06-01"
}
```

- `device` must be `"mobile+pc"` or `"pc"`.
- `added` is `YYYY-MM-DD` (used for date sorting).
- `genre` is any free-text label (Arcade, Racing, Strategy, …).

The site picks up new entries automatically on next load.
