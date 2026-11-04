/*
 * Post-build prerender: turns os/data.js (the single source of portfolio content)
 * into static, crawlable HTML.
 *
 *  - public/index.html     <template id="ph-home">   -> text/mobile home page
 *                          <template id="ph-jsonld"> -> schema.org JSON-LD
 *  - public/os/index.html  <template id="ph-jsonld"> -> schema.org JSON-LD
 *  - public/sitemap.xml
 *
 * Run automatically by `npm run build`.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'public');
const SITE = (process.env.SITE_URL || 'https://amartya.focustriggerautomation.com').replace(/\/$/, '');

// ---------- load content ----------
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'os/data.js'), 'utf8'), sandbox);
const D = sandbox.window;
const P = D.PROFILE, C = D.COMPANY;

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ext = (href, label, cls) => `<a${cls ? ` class="${cls}"` : ''} href="${esc(href)}" target="_blank" rel="noopener">${label}</a>`;
const extMe = (href, label) => `<a href="${esc(href)}" target="_blank" rel="me noopener">${label}</a>`;
const chips = (list) => `<ul class="h-chips">${list.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>`;

// ---------- structured data ----------
const skills = D.SKILLS.slice(0, 3).reduce((a, g) => a.concat(g[2]), []);
const ORG = C.name.replace(/\.$/, '');
const certs = (D.CERTIFICATES || []).map((c) => ({
    '@type': 'EducationalOccupationalCredential',
    name: c.title,
    credentialCategory: 'certificate',
    recognizedBy: { '@type': 'Organization', name: c.issuer },
    ...(c.verify ? { url: c.verify } : {}),
}));
const person = {
    '@type': 'Person',
    '@id': `${SITE}/#person`,
    name: P.name,
    givenName: 'Amartya',
    familyName: 'Sarangee',
    url: `${SITE}/`,
    image: { '@type': 'ImageObject', url: `${SITE}/os/assets/portrait.jpg`, width: 1020, height: 1274 },
    email: `mailto:${P.email}`,
    jobTitle: ['Software Engineer', `${C.title}, ${ORG}`],
    hasOccupation: { '@type': 'Occupation', name: 'Software Engineer', skills: P.focus.join(', ') },
    description: P.bio[0],
    worksFor: { '@id': `${SITE}/#org` },
    alumniOf: { '@type': 'CollegeOrUniversity', name: 'GIET University, Gunupur' },
    address: { '@type': 'PostalAddress', addressLocality: 'Bhubaneswar', addressRegion: 'Odisha', addressCountry: 'IN' },
    knowsAbout: skills,
    knowsLanguage: P.languages.map((l) => l[0]),
    hasCredential: certs,
    sameAs: [P.links.linkedin, P.links.github, P.links.instagram],
};
const org = {
    '@type': 'Organization',
    '@id': `${SITE}/#org`,
    name: ORG,
    url: (C.links[0] || [])[1],
    founder: { '@id': `${SITE}/#person` },
};
const website = { '@type': 'WebSite', '@id': `${SITE}/#website`, url: `${SITE}/`, name: `${P.name} · Portfolio`, publisher: { '@id': `${SITE}/#person` }, inLanguage: 'en' };
const graph = (page) => ({ '@context': 'https://schema.org', '@graph': [person, org, website, page] });
const jsonld = graph({
    '@type': 'ProfilePage',
    '@id': `${SITE}/#profilepage`,
    url: `${SITE}/`,
    name: `${P.name} – ${P.headline.replace(/\u2011/g, '-')}`,
    isPartOf: { '@id': `${SITE}/#website` },
    mainEntity: { '@id': `${SITE}/#person` },
    primaryImageOfPage: { '@type': 'ImageObject', url: `${SITE}/images/preview.jpg`, width: 1200, height: 630 },
    dateModified: new Date().toISOString(),
});
const jsonldOs = graph({
    '@type': 'WebPage',
    '@id': `${SITE}/os/#webpage`,
    url: `${SITE}/os/`,
    name: `AmartyaOS – Interactive portfolio of ${P.name}`,
    isPartOf: { '@id': `${SITE}/#website` },
    about: { '@id': `${SITE}/#person` },
});
const ld = (o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`;
const JSONLD = ld(jsonld);

// ---------- home page ----------
const projectCard = (p) => {
    const links = [];
    if (p.opensCompany) links.push(`<a href="/os/#focustrigger">FocusTrigger details</a>`);
    else links.push(`<a href="/os/#project:${esc(p.id)}">Engineering notes<span class="h-sr"> for ${esc(p.short || p.name)}</span></a>`);
    (p.links || []).forEach((l) => links.push(ext(l[1], `${esc(l[0])} ↗`)));
    return `<article class="h-card" style="--c:${esc(p.color)}">
      <h3>${esc(p.name)}</h3>
      <p class="h-tag">${esc(p.tag)}</p>
      <p>${esc(p.summary)}</p>
      ${p.facts ? `<ul class="h-facts">${p.facts.map((f) => `<li><strong>${esc(f[0])}</strong> ${esc(f[1])}</li>`).join('')}</ul>` : ''}
      ${chips(p.stack)}
      <p class="h-links">${links.join('')}</p>
    </article>`;
};

const HOME = `
<main id="home" class="home">
  <nav class="h-nav" aria-label="Sections">
    <a class="h-logo" href="#top" aria-label="Back to top"><span>AS</span></a>
    <div class="h-nav__links">
      <a href="#about">About</a><a href="#focustrigger">FocusTrigger</a><a href="#projects">Projects</a><a href="#experience">Experience</a><a href="#contact">Contact</a>
    </div>
  </nav>

  <header class="h-hero" id="top">
    <img class="h-photo" src="/os/assets/portrait-264.webp" srcset="/os/assets/portrait-264.webp 264w, /os/assets/portrait-440.webp 440w, /os/assets/portrait.webp 510w" sizes="(min-width: 768px) 220px, 132px" width="510" height="637" alt="Portrait of ${esc(P.name)}" fetchpriority="high">
    <div>
      <p class="h-kicker">Hello, world. I’m</p>
      <h1>${esc(P.name)}</h1>
      <p class="h-headline">${esc(P.headline)}</p>
      <p class="h-focus">${P.focus.map((f) => `<span>${esc(f)}</span>`).join('')}</p>
      <p class="h-role">${esc(P.role)} · ${esc(P.location)}</p>
      <div class="h-cta">
        <a class="h-btn h-btn--dark" href="/os/">Open AmartyaOS <span aria-hidden="true">→</span></a>
        <a class="h-btn" href="mailto:${esc(P.email)}">Email me</a>
      </div>
      <p class="h-3d"><a href="/?3d">View the interactive 3D desk</a> (best on a laptop or desktop)</p>
    </div>
  </header>

  <section id="about" class="h-sec">
    <h2>About</h2>
    ${P.bio.map((b) => `<p>${esc(b)}</p>`).join('\n    ')}
    <p class="h-meta"><strong>Speaks:</strong> ${P.languages.map((l) => `${esc(l[0])} (${esc(l[1].toLowerCase())})`).join(', ')}</p>
  </section>

  <section id="focustrigger" class="h-sec">
    <p class="h-kicker">${esc(C.title)} · ${esc(C.period)}</p>
    <h2>${esc(C.name)}</h2>
    <p class="h-lead">Building <strong>${esc(C.product)}</strong>: ${esc(C.productLine)}</p>
    <div class="h-callout"><strong>My role.</strong> ${esc(C.myRole)}</div>
    <p>${esc(C.productDesc)}</p>
    <p>${esc(C.clientWork)} ${esc(C.approach)}</p>
    ${chips(C.stack)}
    <p class="h-links">${C.links.map((l) => ext(l[1], `${esc(l[0])} ↗`)).join('')}</p>
  </section>

  <section id="projects" class="h-sec">
    <h2>Selected projects</h2>
    <div class="h-grid">
      ${D.PROJECTS.map(projectCard).join('\n      ')}
    </div>
    <p class="h-links h-more">${D.MORE_PROJECTS.map((m) => ext(m[1], esc(m[0]))).join('')}${ext(P.links.github, 'All repositories on GitHub')}</p>
  </section>

  <section id="experience" class="h-sec">
    <h2>Experience</h2>
    <ol class="h-tl">
      ${D.EXPERIENCE.map((e) => `<li${e.current ? ' class="is-current"' : ''}>
        <p class="h-when">${esc(e.period)}${e.place ? ` · ${esc(e.place)}` : ''}</p>
        <h3>${esc(e.title)}</h3>
        <p class="h-org">${esc(e.org)}</p>
        <ul>${e.points.map((pt) => `<li>${esc(pt)}</li>`).join('')}</ul>
        ${e.link ? `<p class="h-links">${ext(e.link[1], `${esc(e.link[0])} ↗`)}</p>` : ''}
      </li>`).join('\n      ')}
    </ol>
  </section>

  <section id="education" class="h-sec">
    <h2>Education</h2>
    <ul class="h-edu">
      ${D.EDUCATION.map((e) => `<li><strong>${esc(e[0])}</strong><span>${esc(e[1])}</span><span class="h-when">${esc(e[2])}</span></li>`).join('\n      ')}
    </ul>
    <p class="h-meta"><strong>Coursework:</strong> ${D.COURSEWORK.map(esc).join(', ')}</p>
  </section>

  <section id="certificates" class="h-sec">
    <h2>Certificates</h2>
    <div class="h-certs">
      ${D.CERTIFICATES.map((c) => `<figure>
        <a href="/${esc(c.image).replace(/^\//, '').replace(/^assets/, 'os/assets')}"><img src="/${esc(c.thumb).replace(/^assets/, 'os/assets')}" width="360" height="256" loading="lazy" alt="${esc(c.title)} certificate, ${esc(c.issuer)}"></a>
        <figcaption><strong>${esc(c.title)}</strong><span>${esc(c.issuer)} · ${esc(c.date)}</span>${c.verify ? ext(c.verify, 'Verify on Credly ↗') : ''}</figcaption>
      </figure>`).join('\n      ')}
    </div>
  </section>

  <section id="skills" class="h-sec">
    <h2>Skills</h2>
    <dl class="h-skills">
      ${D.SKILLS.map((g) => `<div><dt>${esc(g[0])} <span>${esc(g[1])}</span></dt><dd>${chips(g[2])}</dd></div>`).join('\n      ')}
    </dl>
  </section>

  <section id="contact" class="h-sec h-contact">
    <h2>Let’s talk</h2>
    <p>Want to talk about FocusTag, a collaboration, or something you’re building? Send me a message.</p>
    <a class="h-btn h-btn--accent h-mail" href="mailto:${esc(P.email)}">${esc(P.email).replace('@', '@<wbr>')}</a>
    <p class="h-links">${extMe(P.links.linkedin, 'LinkedIn ↗')}${extMe(P.links.github, 'GitHub ↗')}${extMe(P.links.instagram, 'Instagram ↗')}</p>
  </section>

  <footer class="h-foot">
    <p>© ${new Date().getFullYear()} ${esc(P.name)} · ${esc(P.location)}</p>
    <p>The 3D desk is based on <a href="https://github.com/henryjeff/portfolio-website" rel="noopener">Henry Heffernan’s MIT-licensed project</a>.</p>
  </footer>
</main>`;

// ---------- inject ----------
function inject(file, map) {
    const fp = path.join(OUT, file);
    let html = fs.readFileSync(fp, 'utf8');
    for (const [marker, value] of Object.entries(map)) {
        const tag = `<template id="${marker}"></template>`;
        if (!html.includes(tag)) throw new Error(`prerender: marker ${marker} not found in ${file}`);
        html = html.replace(tag, value);
    }
    fs.writeFileSync(fp, html);
    console.log(`prerender: ${file} (${Object.keys(map).join(', ')})`);
}
inject('index.html', { 'ph-home': HOME, 'ph-jsonld': JSONLD });
inject('os/index.html', { 'ph-jsonld': ld(jsonldOs) });

const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(
    path.join(OUT, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url><loc>${SITE}/</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>1.0</priority>
    <image:image><image:loc>${SITE}/os/assets/portrait.jpg</image:loc></image:image></url>
  <url><loc>${SITE}/os/</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
</urlset>
`
);
console.log('prerender: sitemap.xml');
