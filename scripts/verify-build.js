/*
 * Build verification: `npm test` (run after `npm run build`).
 * Checks the production output in ./public without any dependencies.
 * Exits non-zero if anything is wrong.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const OUT = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve(__dirname, '..', 'public');
const errors = [];
let checks = 0;
const ok = (cond, msg) => { checks++; if (!cond) errors.push(msg); };
const read = (f) => fs.readFileSync(path.join(OUT, f), 'utf8');
const exists = (f) => fs.existsSync(path.join(OUT, f));

// ---------- required files ----------
['index.html', 'os/index.html', '404.html', 'robots.txt', 'sitemap.xml', 'site.webmanifest',
 'images/preview.jpg', 'images/favicon.ico', 'images/apple-touch-icon.png', 'home.css', 'fonts/fonts.css']
    .forEach((f) => ok(exists(f), `missing required file: ${f}`));

// ---------- helpers ----------
function resolveUrl(u, baseDir) {
    u = u.split('#')[0].split('?')[0];
    if (!u) return null;
    let p = u.startsWith('/') ? u.slice(1) : path.posix.join(baseDir, u);
    if (p === '' || p.endsWith('/')) p += 'index.html';
    return decodeURIComponent(p);
}
const isExternal = (u) => /^(https?:|mailto:|tel:|data:|javascript:)/.test(u) || u.startsWith('#');

function checkHtml(file) {
    const html = read(file);
    const baseDir = path.posix.dirname(file) === '.' ? '' : path.posix.dirname(file);
    // internal href/src
    for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
        const u = m[1];
        if (isExternal(u) || u.includes('${')) continue;
        const target = resolveUrl(u, baseDir);
        if (target) ok(exists(target), `${file}: broken internal link ${u}`);
    }
    for (const m of html.matchAll(/\ssrcset="([^"]+)"/g)) {
        for (const part of m[1].split(',')) {
            const u = part.trim().split(/\s+/)[0];
            ok(exists(resolveUrl(u, baseDir)), `${file}: broken srcset entry ${u}`);
        }
    }
    // images need alt
    for (const m of html.matchAll(/<img\b[^>]*>/g)) ok(/\salt=/.test(m[0]), `${file}: <img> without alt: ${m[0].slice(0, 80)}`);
    // unique ids
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
    const dup = ids.filter((id, i) => ids.indexOf(id) !== i);
    ok(dup.length === 0, `${file}: duplicate ids ${[...new Set(dup)].join(', ')}`);
    // no third-party fonts / mixed content
    ok(!/fonts\.(googleapis|gstatic)\.com/.test(html), `${file}: still references Google Fonts`);
    ok(!/\s(?:href|src)="http:\/\//.test(html), `${file}: insecure http:// reference`);
    return html;
}

function checkMeta(file, { h1 = true } = {}) {
    const html = read(file);
    const titles = [...html.matchAll(/<title>([^<]*)<\/title>/g)];
    ok(titles.length === 1, `${file}: expected exactly one <title>`);
    const desc = (html.match(/name="description"\s+content="([^"]*)"/) || [])[1] || '';
    ok(desc.length >= 50 && desc.length <= 170, `${file}: meta description length ${desc.length} (want 50-170)`);
    const canon = (html.match(/rel="canonical" href="([^"]+)"/) || [])[1] || '';
    ok(/^https:\/\//.test(canon), `${file}: canonical must be an absolute https URL`);
    ok(/<html lang="en"/.test(html), `${file}: missing lang="en"`);
    ok(/name="viewport"/.test(html), `${file}: missing viewport meta`);
    if (h1) ok((html.match(/<h1[\s>]/g) || []).length === 1, `${file}: expected exactly one <h1> in the prerendered HTML`);
    const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
    ok(ld.length === 1, `${file}: expected one JSON-LD block`);
    if (ld.length) {
        try {
            const g = JSON.parse(ld[0][1])['@graph'];
            const person = g.find((n) => n['@type'] === 'Person');
            ok(person && person.name && person.url, `${file}: JSON-LD Person incomplete`);
            ok(g.some((n) => n['@type'] === 'Organization'), `${file}: JSON-LD missing Organization`);
        } catch (e) { errors.push(`${file}: JSON-LD does not parse (${e.message})`); }
    }
    return canon;
}

// ---------- pages ----------
checkHtml('index.html'); checkHtml('os/index.html'); checkHtml('404.html');
const canonRoot = checkMeta('index.html');
checkMeta('os/index.html', { h1: false });
ok(/noindex/.test(read('404.html')), '404.html should be noindex');

// ---------- CSS url() references ----------
for (const css of ['home.css', 'os/os.css', 'fonts/fonts.css']) {
    if (!exists(css)) continue; // already reported above if required
    const dir = path.posix.dirname(css) === '.' ? '' : path.posix.dirname(css);
    for (const m of read(css).matchAll(/url\((['"]?)([^'")]+)\1\)/g)) {
        if (isExternal(m[2])) continue;
        ok(exists(resolveUrl(m[2], dir)), `${css}: url() points to missing file ${m[2]}`);
    }
}

// ---------- content file (os/data.js) ----------
const sb = { window: {} };
vm.runInNewContext(read('os/data.js'), sb);
const D = sb.window;
const ids = D.PROJECTS.map((p) => p.id);
ok(new Set(ids).size === ids.length, 'data.js: duplicate project ids');
for (const p of D.PROJECTS) {
    ok(p.name && p.summary && Array.isArray(p.stack), `data.js: project ${p.id} missing name/summary/stack`);
    for (const l of p.links || []) ok(/^https:\/\//.test(l[1]), `data.js: project ${p.id} link not https: ${l[1]}`);
}
for (const c of D.CERTIFICATES) {
    ok(exists('os/' + c.image), `data.js: certificate image missing ${c.image}`);
    ok(exists('os/' + c.thumb), `data.js: certificate thumb missing ${c.thumb}`);
}
ok(D.SKILLS.every((g) => typeof g[0] === 'string' && typeof g[1] === 'string' && Array.isArray(g[2])), 'data.js: SKILLS groups must be [name, note, items]');
// deep links used by the prerendered page must exist in the OS
const APPS = ['about', 'focustrigger', 'projects', 'experience', 'certificates', 'skills', 'terminal', 'contact'];
for (const m of read('index.html').matchAll(/href="\/os\/#([^"]+)"/g)) {
    const id = m[1];
    const valid = APPS.includes(id) || (id.startsWith('project:') && ids.includes(id.slice(8)));
    ok(valid, `index.html: deep link /os/#${id} does not match an app or project`);
}
for (const m of read('404.html').matchAll(/href="\/os\/#([^"]+)"/g)) ok(APPS.includes(m[1]), `404.html: deep link /os/#${m[1]} invalid`);

// ---------- sitemap / robots / manifest ----------
const site = canonRoot.replace(/\/$/, '');
for (const m of read('sitemap.xml').matchAll(/<loc>([^<]+)<\/loc>/g)) {
    ok(m[1].startsWith(site), `sitemap: ${m[1]} is not on ${site}`);
    ok(exists(resolveUrl(m[1].slice(site.length) || '/', '')), `sitemap: ${m[1]} has no matching file`);
}
ok(read('robots.txt').includes(`Sitemap: ${site}/sitemap.xml`), 'robots.txt: missing or wrong Sitemap line');
const manifest = JSON.parse(read('site.webmanifest'));
for (const i of manifest.icons) ok(exists(i.src.slice(1)), `manifest: icon missing ${i.src}`);

// ---------- report ----------
if (errors.length) {
    console.error(`verify-build: ${errors.length} problem(s) in ${checks} checks`);
    errors.forEach((e) => console.error('  ✗ ' + e));
    process.exit(1);
}
console.log(`verify-build: all ${checks} checks passed`);
