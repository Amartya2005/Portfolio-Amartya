# Amartya Sarangee · Portfolio

My portfolio is an old desk computer in 3D. Click the monitor and you're inside
**AmartyaOS**, a small retro desktop where each window covers part of my work:
FocusTrigger and FocusTag, my projects, experience, certificates, skills, a
working terminal, and a way to contact me.

- **3D scene** (`src/`, `static/`): Three.js, React and TypeScript, bundled with webpack.
- **AmartyaOS** (`os/`): plain HTML, CSS and JavaScript with no build step. The scene
  loads it inside the monitor, and it also works on its own at `/os/`, which is
  the version phones get.

## How visitors see it

- **Desktop:** the 3D desk. The 3D code is a separate chunk that loads only in this mode.
- **Phones (under 768px wide):** a fast one-page profile (`/`), with links into AmartyaOS (`/os/`).
  Phones don't download the 3D scene. `/?3d` forces the desk, and `/?text` forces the text page.
- **Search engines and screen readers:** the text page is prerendered into `index.html` at build
  time (`scripts/prerender.js`), together with schema.org JSON-LD (Person, WebSite, ProfilePage)
  and `sitemap.xml`. It is all generated from `os/data.js`.

## Updating content

Everything on the site lives in **`os/data.js`**: bio, projects, experience,
education, certificates and skills. Edit that file and redeploy.

- New certificate: add the image to `os/assets/certs/` and an entry to `CERTIFICATES`.
- New project: add an entry to `PROJECTS`.
- Deep links work: `/os/#projects`, `/os/#contact`, `/os/#certificates` and so on.

## Develop

```bash
npm ci
npm run dev      # 3D site at http://localhost:8080 (OS at /os/)
npm run build    # production build in ./public
```

To work on the OS alone, serve the `os/` folder with any static server.

## Deploy

The project is set up for Vercel (`vercel.json`): build command `npm run build`,
output directory `public`. Any static host works.

## Credits

The 3D desk scene is a modified fork of
[Henry Heffernan's portfolio](https://github.com/henryjeff/portfolio-website)
(MIT). The original credits are Henry Heffernan (development, sound, texturing),
Mickael Boitte (computer model) and Sean Nicolas (environment models).
AmartyaOS, all content and the re-branded textures are by Amartya Sarangee.
See [LICENSE.md](LICENSE.md).
