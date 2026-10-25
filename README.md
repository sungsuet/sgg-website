# (주)성수공학기술 홈페이지

Seongsu Engineering & Technology homepage: a static site (HTML, CSS, a little JS), no build step.

Live site: https://sungsuet.github.io/sgg-website/ (GitHub Pages, deployed from `main`)

## Run locally

```bash
python3 -m http.server 4173
```

Then open http://localhost:4173.

## Files

- `index.html` — all page sections (홈, 드론사업, 스마트팩토리, 기술·연구, 수행사례, 회사소개, 파트너십, 문의)
- `ds/styles.css` — design-system tokens and components (from Claude Design; retune the look here)
- `css/site.css` — page layout and responsive rules
- `js/main.js` — mobile menu, current-section nav highlight, contact form

## Editing content

- **Images:** every photo spot is a `.media` box with a placeholder caption. Put the file in `images/` and replace the `<span class="media__ph">…</span>` with `<img src="images/…" alt="…">`.
- **Placeholders:** text in square brackets (`[20__]`, `[발주처]`, `[4.0 h]`, `[사업자등록번호]`, …) still needs real content.
- **Contact form:** opens the visitor's mail app addressed to `data-mailto` on the form. To send directly from the page, set `data-endpoint` to a form-service URL that accepts a JSON POST.
