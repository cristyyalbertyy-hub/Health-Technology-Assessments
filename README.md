# Health Technology Assessment

Interactive learning app with three HTA chapters. Each chapter offers video, podcast, infographic, and questionnaire content.

## Local development

```bash
npm install
npm run dev
```

## Deploy on Vercel

1. Push this repository to GitHub (media files in `Public/` are included).
2. In [Vercel](https://vercel.com), import the GitHub repository.
3. Use the default settings for a Vite project:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Deploy. Vercel will rebuild on every push to the default branch.

`vercel.json` is included for SPA routing.

## Media files

Assets live in `Public/` and are served from the site root, for example:

- `/HTA_ER_V.mp4` — video
- `/HTA_ER_P.m4a` — podcast
- `/HTA_ER_I.png` — infographic
- `/HTA_ER_Q.csv` — questionnaire

Same pattern for `HTA_CCA_*` and `HTA_HTAS_*`.
