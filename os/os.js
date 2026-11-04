/* AmartyaOS: a small desktop environment for Amartya Sarangee's portfolio.
   Written from scratch; runs standalone at /os/ or inside the 3D monitor. */
(function () {
  'use strict';

  var P = window.PROFILE, C = window.COMPANY;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var ext = function (href, label, cls) {
    return '<a class="' + (cls || 'link') + '" href="' + esc(href) + '" target="_blank" rel="noopener">' + label + '</a>';
  };

  /* ------------------------------------------------------------------
     Bridge to the 3D scene: forward input so the camera and the
     keyboard/mouse sounds react while the visitor uses the monitor.
     ------------------------------------------------------------------ */
  var inFrame = window.parent && window.parent !== window;
  if (inFrame) {
    ['mousemove', 'mousedown', 'mouseup'].forEach(function (type) {
      document.addEventListener(type, function (e) {
        window.parent.postMessage({ type: type, clientX: e.clientX, clientY: e.clientY }, '*');
      }, true);
    });
    ['keydown', 'keyup'].forEach(function (type) {
      document.addEventListener(type, function (e) {
        window.parent.postMessage({ type: type, key: e.key }, '*');
      }, true);
    });
  }

  /* ------------------------------------------------------------------
     Icons (16×16 pixel art)
     ------------------------------------------------------------------ */
  var K = '#141414', W = '#f6f0e4', O = '#ff5a1f', B = '#4b6bff', G = '#1fb36b', Y = '#ffcf3a';
  function svg(body) {
    return '<svg viewBox="0 0 16 16" shape-rendering="crispEdges" aria-hidden="true">' + body + '</svg>';
  }
  function r(x, y, w, h, f) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + f + '"/>'; }
  var ICONS = {
    user: svg(r(5, 1, 6, 1, K) + r(4, 2, 1, 5, K) + r(11, 2, 1, 5, K) + r(5, 7, 6, 1, K) + r(5, 2, 6, 5, Y) + r(6, 4, 1, 1, K) + r(9, 4, 1, 1, K) + r(7, 6, 2, 1, O) +
      r(3, 9, 10, 1, K) + r(2, 10, 1, 5, K) + r(13, 10, 1, 5, K) + r(2, 15, 12, 1, K) + r(3, 10, 10, 5, O) + r(7, 10, 2, 5, W)),
    tag: svg(r(2, 3, 9, 1, K) + r(1, 4, 1, 9, K) + r(2, 13, 9, 1, K) + r(11, 4, 1, 9, K) + r(2, 4, 9, 9, O) + r(4, 6, 5, 5, K) + r(5, 7, 3, 3, W) + r(6, 8, 1, 1, O) +
      r(13, 6, 1, 5, K) + r(14, 4, 1, 1, K) + r(15, 5, 1, 7, K) + r(14, 12, 1, 1, K)),
    folder: svg(r(1, 3, 6, 1, K) + r(0, 4, 1, 10, K) + r(7, 4, 1, 1, K) + r(8, 5, 7, 1, K) + r(15, 5, 1, 9, K) + r(1, 14, 14, 1, K) + r(1, 4, 6, 10, Y) + r(7, 5, 1, 9, Y) + r(8, 6, 7, 8, Y) +
      r(1, 7, 14, 1, K) + r(1, 8, 14, 6, '#ffb000')),
    case: svg(r(5, 2, 6, 1, K) + r(5, 3, 1, 2, K) + r(10, 3, 1, 2, K) + r(1, 5, 14, 1, K) + r(0, 6, 1, 8, K) + r(15, 6, 1, 8, K) + r(1, 14, 14, 1, K) + r(1, 6, 14, 8, '#8a5a2b') +
      r(1, 9, 14, 1, K) + r(7, 8, 2, 3, Y) + r(7, 8, 2, 1, K)),
    award: svg(r(4, 9, 2, 6, B) + r(10, 9, 2, 6, B) + r(4, 15, 1, 1, K) + r(11, 15, 1, 1, K) + r(5, 1, 6, 1, K) + r(3, 2, 2, 1, K) + r(11, 2, 2, 1, K) + r(2, 3, 1, 5, K) + r(13, 3, 1, 5, K) +
      r(3, 8, 2, 1, K) + r(11, 8, 2, 1, K) + r(5, 9, 6, 1, K) + r(3, 2, 10, 7, Y) + r(5, 1, 6, 1, K) + r(6, 4, 4, 3, O) + r(7, 3, 2, 5, O)),
    chip: svg(r(3, 3, 10, 10, K) + r(4, 4, 8, 8, G) + r(6, 6, 4, 4, K) + r(7, 7, 2, 2, Y) +
      r(5, 1, 1, 2, K) + r(8, 1, 1, 2, K) + r(11, 1, 1, 2, K) + r(5, 13, 1, 2, K) + r(8, 13, 1, 2, K) + r(11, 13, 1, 2, K) +
      r(1, 5, 2, 1, K) + r(1, 8, 2, 1, K) + r(1, 11, 2, 1, K) + r(13, 5, 2, 1, K) + r(13, 8, 2, 1, K) + r(13, 11, 2, 1, K)),
    term: svg(r(0, 2, 16, 12, K) + r(1, 4, 14, 9, '#0b0d16') + r(1, 2, 14, 2, W) + r(2, 2, 1, 1, O) + r(4, 2, 1, 1, Y) + r(6, 2, 1, 1, G) +
      r(3, 6, 1, 1, G) + r(4, 7, 1, 1, G) + r(3, 8, 1, 1, G) + r(6, 9, 4, 1, W)),
    mail: svg(r(0, 3, 16, 1, K) + r(0, 4, 1, 9, K) + r(15, 4, 1, 9, K) + r(0, 13, 16, 1, K) + r(1, 4, 14, 9, W) +
      r(1, 4, 2, 1, K) + r(3, 5, 2, 1, K) + r(5, 6, 2, 1, K) + r(7, 7, 2, 1, O) + r(9, 6, 2, 1, K) + r(11, 5, 2, 1, K) + r(13, 4, 2, 1, K)),
    doc: svg(r(3, 1, 8, 1, K) + r(2, 2, 1, 13, K) + r(13, 4, 1, 11, K) + r(2, 15, 12, 1, K) + r(11, 2, 1, 2, K) + r(12, 3, 1, 1, K) + r(3, 2, 8, 13, W) + r(11, 4, 2, 11, W) +
      r(5, 6, 6, 1, K) + r(5, 8, 6, 1, K) + r(5, 10, 6, 1, K) + r(5, 12, 4, 1, O)),
    image: svg(r(0, 2, 16, 12, K) + r(1, 3, 14, 10, '#9fc3ff') + r(10, 4, 3, 3, Y) + r(1, 9, 4, 4, G) + r(5, 8, 3, 5, G) + r(8, 10, 7, 3, G)),
    link: svg(r(2, 6, 5, 1, K) + r(1, 7, 1, 3, K) + r(2, 10, 5, 1, K) + r(9, 6, 5, 1, K) + r(14, 7, 1, 3, K) + r(9, 10, 5, 1, K) + r(5, 8, 6, 1, O)),
    power: svg(r(7, 1, 2, 7, O) + r(4, 3, 1, 1, K) + r(3, 4, 1, 1, K) + r(2, 5, 1, 6, K) + r(3, 11, 1, 1, K) + r(4, 12, 1, 1, K) + r(5, 13, 6, 1, K) + r(11, 12, 1, 1, K) + r(12, 11, 1, 1, K) + r(13, 5, 1, 6, K) + r(12, 4, 1, 1, K) + r(11, 3, 1, 1, K)),
  };

  /* ------------------------------------------------------------------
     App renderers
     ------------------------------------------------------------------ */
  function chips(list, cls) {
    return '<ul class="chips">' + list.map(function (t) { return '<li class="chip ' + (cls || '') + '">' + esc(t) + '</li>'; }).join('') + '</ul>';
  }

  function renderAbout() {
    return '<div class="pad"><div class="about">' +
      '<figure class="about__photo"><img src="assets/portrait.webp" alt="Portrait of Amartya Sarangee" width="510" height="637">' +
      '<figcaption><span>amartya.jpg</span><span>4:5</span></figcaption></figure>' +
      '<div class="stack-y">' +
        '<p class="kicker kicker--accent">Hello, world. I’m</p>' +
        '<h1 class="h1">' + esc(P.name) + '</h1>' +
        '<p class="h3">' + esc(P.headline) + '</p>' +
        '<p class="focus">' + P.focus.map(function (f) { return '<span>' + esc(f) + '</span>'; }).join('') + '</p>' +
        P.bio.map(function (p) { return '<p class="lead">' + esc(p) + '</p>'; }).join('') +
        '<dl class="about__meta">' +
          '<dt>Based in</dt><dd>' + esc(P.location) + '</dd>' +
          '<dt>Studying</dt><dd>B.Tech CS, GIET University (2024 – 2028)</dd>' +
          '<dt>Speaks</dt><dd>' + P.languages.map(function (l) { return esc(l[0]) + ' <span class="muted">(' + esc(l[1].toLowerCase()) + ')</span>'; }).join(', ') + '</dd>' +
        '</dl>' +
        '<div class="btns">' +
          '<button class="btn btn--dark" data-open="projects">' + ICONS.folder + 'See my projects</button>' +
          '<button class="btn" data-open="focustrigger">' + ICONS.tag + 'FocusTrigger</button>' +
          '<button class="btn" data-open="contact">' + ICONS.mail + 'Contact</button>' +
        '</div>' +
      '</div></div></div>';
  }

  function renderCompany() {
    return '<div class="hero-card">' +
        '<p class="kicker">' + esc(C.title) + ' · ' + esc(C.period) + '</p>' +
        '<h1 class="h1">' + esc(C.name) + '</h1>' +
        '<p>' + esc(C.place) + '. Building <strong>' + esc(C.product) + '</strong>: ' + esc(C.productLine) + '</p>' +
      '</div>' +
      '<div class="pad stack-y">' +
        '<div class="role-banner">' + ICONS.chip + '<div><p class="kicker kicker--accent">My role</p><p class="lead" style="margin-top:4px">' + esc(C.myRole) + '</p></div></div>' +
        '<h2 class="h2" style="margin-top:22px">' + esc(C.product) + '</h2>' +
        '<p class="lead">' + esc(C.productDesc) + '</p>' +
        '<div class="facts">' +
          '<div class="fact"><strong>NFC</strong><span>direct phone-to-phone interaction</span></div>' +
          '<div class="fact"><strong>QR</strong><span>fallback when NFC isn’t available</span></div>' +
          '<div class="fact"><strong>Admin</strong><span>dashboard for classrooms</span></div>' +
        '</div>' +
        chips(C.stack) +
        '<hr class="rule">' +
        '<h3 class="h3">Client work</h3><p>' + esc(C.clientWork) + '</p>' +
        '<h3 class="h3">How we work</h3><p>' + esc(C.approach) + '</p>' +
        '<div class="btns" style="margin-top:18px">' + C.links.map(function (l) { return ext(l[1], ICONS.link + esc(l[0]) + ' ↗', 'btn btn--dark'); }).join('') + '</div>' +
      '</div>';
  }

  function renderProjects() {
    return '<div class="pad stack-y">' +
      '<p class="kicker">C:\\Users\\Amartya\\Projects · ' + window.PROJECTS.length + ' items</p>' +
      '<h1 class="h1">Selected work</h1>' +
      '<p class="lead">Systems I’ve built and the decisions behind them. Open any project to read the engineering notes.</p>' +
      '<div class="proj-list">' + window.PROJECTS.map(function (p) {
        return '<button class="proj" data-project="' + p.id + '">' +
          '<span class="proj__top"><span class="proj__sw" style="background:' + p.color + '"></span><span class="proj__name">' + esc(p.short || p.name) + '</span></span>' +
          '<span class="proj__tag">' + esc(p.tag) + '</span>' +
          '<span class="proj__sum">' + esc(p.summary) + '</span>' +
          '<span class="proj__open">Open ›</span></button>';
      }).join('') + '</div>' +
      '<hr class="rule">' +
      '<p class="kicker">More</p>' +
      '<p class="more">' + window.MORE_PROJECTS.map(function (m) { return ext(m[1], esc(m[0]) + ' ↗'); }).join('') + ext(P.links.github, 'All repositories ↗') + '</p>' +
      '</div>';
  }

  function renderProject(p) {
    return '<header class="detail__head" style="border-top:8px solid ' + p.color + '">' +
        '<p class="kicker">' + esc(p.tag) + '</p>' +
        '<h1 class="h1">' + esc(p.name) + '</h1>' +
        '<p class="lead" style="margin-top:8px">' + esc(p.summary) + '</p>' +
      '</header>' +
      '<div class="pad stack-y">' +
        (p.facts ? '<div class="facts">' + p.facts.map(function (f) { return '<div class="fact"><strong>' + esc(f[0]) + '</strong><span>' + esc(f[1]) + '</span></div>'; }).join('') + '</div>' : '') +
        chips(p.stack) +
        '<div class="sections" style="margin-top:20px">' + (p.sections || []).map(function (s) {
          return '<section><h3>' + esc(s[0]) + '</h3><p>' + esc(s[1]) + '</p></section>';
        }).join('') + '</div>' +
        (p.links ? '<div class="btns" style="margin-top:20px">' + p.links.map(function (l, i) {
          return ext(l[1], ICONS.link + esc(l[0]) + ' ↗', i === 0 ? 'btn btn--dark' : 'btn');
        }).join('') + '</div>' : '') +
      '</div>';
  }

  function renderExperience() {
    return '<div class="pad">' +
      '<p class="kicker">Work history</p><h1 class="h1" style="margin:6px 0 22px">Experience</h1>' +
      '<ol class="tl">' + window.EXPERIENCE.map(function (e) {
        return '<li class="tl__item' + (e.current ? ' is-current' : '') + '">' +
          '<p class="tl__period">' + esc(e.period) + (e.place ? ' · ' + esc(e.place) : '') + (e.current ? ' · <strong style="color:var(--accent-text)">NOW</strong>' : '') + '</p>' +
          '<h2 class="tl__title">' + esc(e.title) + '</h2>' +
          '<p class="tl__org">' + esc(e.org) + '</p>' +
          '<ul class="tl__pts">' + e.points.map(function (pt) { return '<li>' + esc(pt) + '</li>'; }).join('') + '</ul>' +
          (e.link ? '<p style="margin-top:8px">' + ext(e.link[1], esc(e.link[0]) + ' ↗') + '</p>' : '') +
          '</li>';
      }).join('') + '</ol>' +
      '<hr class="rule">' +
      '<p class="kicker">Education</p><h2 class="h2" style="margin:6px 0 14px">Where I studied</h2>' +
      '<div class="edu">' + window.EDUCATION.map(function (ed) {
        return '<div class="edu__row"><strong>' + esc(ed[0]) + '</strong><span>' + esc(ed[2]) + '</span><p class="muted" style="grid-column:1/-1">' + esc(ed[1]) + '</p></div>';
      }).join('') + '</div>' +
      '<p class="kicker" style="margin:18px 0 10px">Coursework</p>' + chips(window.COURSEWORK) +
      '</div>';
  }

  function renderCerts() {
    return '<div class="pad">' +
      '<p class="kicker">Credentials</p><h1 class="h1" style="margin:6px 0 20px">Certificates</h1>' +
      '<div class="certs">' + window.CERTIFICATES.map(function (c, i) {
        return '<article class="cert">' +
          '<button class="cert__img" data-cert="' + i + '" aria-label="View certificate: ' + esc(c.title) + '"><img src="' + esc(c.thumb) + '" alt="" loading="lazy"></button>' +
          '<div class="cert__body"><h2 class="cert__title">' + esc(c.title) + '</h2>' +
          '<p class="cert__meta">' + esc(c.issuer) + ' · ' + esc(c.date) + '</p>' +
          (c.id ? '<p class="cert__meta">ID: ' + esc(c.id) + '</p>' : '') +
          (c.verify ? '<p style="margin-top:4px">' + ext(c.verify, 'Verify on Credly ↗') + '</p>' : '') +
          '</div></article>';
      }).join('') + '</div>' +
      '<p class="muted" style="margin-top:18px;font-size:14px">More certificates coming soon.</p>' +
      '</div>';
  }

  function renderCertViewer(c) {
    return '<div class="viewer"><img src="' + esc(c.image) + '" alt="' + esc(c.title + ' certificate from ' + c.issuer) + '"></div>';
  }

  function renderSkills() {
    return '<div class="pad">' +
      '<p class="kicker">System properties · grouped by depth</p><h1 class="h1" style="margin:6px 0 20px">Skills</h1>' +
      '<div class="sys">' + window.SKILLS.map(function (g) {
        return '<div class="sys__row"><div class="sys__k">' + esc(g[0]) + '<span class="sys__note">' + esc(g[1]) + '</span></div><div class="sys__v">' + chips(g[2]) + '</div></div>';
      }).join('') + '</div>' +
      '</div>';
  }

  function renderContact() {
    return '<div class="pad stack-y">' +
      '<p class="kicker">New message</p><h1 class="h1">Let’s talk</h1>' +
      '<p class="lead">Want to talk about FocusTag, a collaboration, or something you’re building? Send me a message.</p>' +
      '<form class="form" id="contact-form" novalidate>' +
        '<label>Your name<input name="name" autocomplete="name" required></label>' +
        '<label>Message<textarea name="message" required placeholder="Hi Amartya, …"></textarea></label>' +
        '<div class="btns"><button class="btn btn--dark" type="submit">' + ICONS.mail + 'Send via email</button>' +
        '<button class="btn" type="button" data-copy-email>Copy email address</button></div>' +
      '</form>' +
      '<hr class="rule">' +
      '<div class="contact-links">' +
        ext('mailto:' + P.email, 'Email <span>↗</span>', 'btn') +
        ext(P.links.linkedin, 'LinkedIn <span>↗</span>', 'btn') +
        ext(P.links.github, 'GitHub <span>↗</span>', 'btn') +
        ext(P.links.instagram, 'Instagram <span>↗</span>', 'btn') +
      '</div>' +
      '<p class="muted" style="font-size:14px">' + esc(P.email) + ' · ' + esc(P.location) + '</p>' +
      '</div>';
  }

  /* ------------------------------------------------------------------
     Terminal
     ------------------------------------------------------------------ */
  function renderTerminal() {
    return '<div class="term"><div class="term__out"></div>' +
      '<div class="term__line"><span class="term__ps1">amartya@os:~$</span>' +
      '<input class="term__in" aria-label="Terminal input" autocomplete="off" autocapitalize="off" spellcheck="false"></div></div>';
  }

  function mountTerminal(win) {
    var out = $('.term__out', win.el), input = $('.term__in', win.el), body = $('.win__body', win.el);
    var hist = [], hi = 0;
    function print(html, cls) {
      var d = document.createElement('div');
      if (cls) d.className = cls;
      d.innerHTML = html;
      out.appendChild(d);
      body.scrollTop = body.scrollHeight;
    }
    var apps = Object.keys(APPS).join(', ');
    var CMDS = {
      help: function () {
        return [
          '<span class="c-acc">Available commands</span>',
          '  whoami        who is Amartya?',
          '  focustag      what I’m building',
          '  projects      list projects',
          '  experience    work history',
          '  skills        tech stack',
          '  certs         certificates',
          '  contact       ways to reach me',
          '  open &lt;app&gt;    open an app (' + apps + ')',
          '  neofetch      system info',
          '  clear         clear the screen',
        ].join('\n');
      },
      whoami: function () { return '<span class="c-ok">' + esc(P.name) + '</span>\n' + esc(P.headline) + '\n' + esc(P.role) + '\n' + esc(P.location); },
      focustag: function () { return '<span class="c-acc">' + esc(C.product) + '</span> by ' + esc(C.name) + '\n' + esc(C.productDesc) + '\n\nMy role: ' + esc(C.myRole); },
      projects: function () {
        return window.PROJECTS.map(function (p) { return '  <span class="c-ok">' + esc((p.short || p.name).padEnd(16)) + '</span>' + esc(p.summary); }).join('\n') + '\n\n<span class="c-dim">tip: open projects</span>';
      },
      experience: function () {
        return window.EXPERIENCE.map(function (e) { return '  <span class="c-ok">' + esc(e.period.padEnd(20)) + '</span>' + esc(e.title) + ' @ ' + esc(e.org); }).join('\n');
      },
      skills: function () { return window.SKILLS.map(function (g) { return '<span class="c-acc">' + esc(g[0]) + '</span> <span class="c-dim">(' + esc(g[1].toLowerCase()) + ')</span>\n  ' + esc(g[2].join(', ')); }).join('\n\n'); },
      certs: function () { return window.CERTIFICATES.map(function (c) { return '  ✔ ' + esc(c.title) + ' <span class="c-dim">(' + esc(c.issuer) + ', ' + esc(c.date) + ')</span>'; }).join('\n'); },
      contact: function () {
        return '  email     <a href="mailto:' + esc(P.email) + '">' + esc(P.email) + '</a>\n' +
          '  linkedin  <a href="' + esc(P.links.linkedin) + '" target="_blank" rel="noopener">linkedin.com/in/amartya-sarangee-3351a8241</a>\n' +
          '  github    <a href="' + esc(P.links.github) + '" target="_blank" rel="noopener">github.com/Amartya2005</a>';
      },
      neofetch: function () {
        return '<span class="c-acc">   █████   ███████ </span>  <span class="c-ok">amartya</span>@<span class="c-ok">os</span>\n' +
          '<span class="c-acc">  ██   ██  ██      </span>  ----------------\n' +
          '<span class="c-acc">  ███████  ███████ </span>  OS: AmartyaOS 1.0\n' +
          '<span class="c-acc">  ██   ██       ██ </span>  Role: Co-Founder & Director\n' +
          '<span class="c-acc">  ██   ██  ███████ </span>  Building: FocusTag\n' +
          '                      Uni: GIET University (CS, 3rd yr)\n' +
          '                      Focus: ' + esc(P.focus.join(', ')) + '\n' +
          '                      Shell: Python, FastAPI, React';
      },
      date: function () { return new Date().toString(); },
      ls: function () { return 'about.txt  focustrigger/  projects/  experience.log  certificates/  skills.sys  contact.eml'; },
      pwd: function () { return '/home/amartya'; },
      echo: function (args) { return esc(args.join(' ')); },
      sudo: function () { return '<span class="c-acc">Permission granted.</span> Running <span class="c-ok">hire-amartya</span>… opening Contact.' + (openApp('contact'), ''); },
      open: function (args) {
        var id = (args[0] || '').toLowerCase();
        if (APPS[id]) { openApp(id); return 'opening ' + esc(id) + '…'; }
        return 'open: unknown app "' + esc(id) + '". Try: ' + apps;
      },
      clear: function () { out.innerHTML = ''; return null; },
      exit: function () { closeWin(win.id); return null; },
    };
    CMDS.about = CMDS.whoami; CMDS.cat = function (a) { return a[0] === 'about.txt' ? CMDS.whoami() : 'cat: ' + esc(a[0] || '') + ': try "ls"'; };
    function run(line) {
      print('<span class="term__ps1">amartya@os:~$</span> ' + esc(line));
      var parts = line.trim().split(/\s+/), cmd = (parts.shift() || '').toLowerCase();
      if (!cmd) return;
      hist.push(line); hi = hist.length;
      var fn = CMDS[cmd];
      var res = fn ? fn(parts) : 'command not found: ' + esc(cmd) + '. Type <span class="c-acc">help</span>.';
      if (res !== null && res !== undefined) print(res);
    }
    print('<span class="c-acc">AmartyaOS terminal</span> <span class="c-dim">v1.0</span>\nType <span class="c-ok">help</span> to see what I can do.\n');
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { run(input.value); input.value = ''; }
      else if (e.key === 'ArrowUp') { if (hi > 0) input.value = hist[--hi]; e.preventDefault(); }
      else if (e.key === 'ArrowDown') { if (hi < hist.length - 1) input.value = hist[++hi]; else { hi = hist.length; input.value = ''; } e.preventDefault(); }
      else if (e.key === 'l' && e.ctrlKey) { out.innerHTML = ''; e.preventDefault(); }
    });
    win.el.addEventListener('mouseup', function () { if (!String(window.getSelection())) input.focus(); });
    setTimeout(function () { input.focus(); }, 50);
  }

  /* ------------------------------------------------------------------
     App registry
     ------------------------------------------------------------------ */
  var APPS = {
    about: { title: 'About Me', icon: 'user', w: 780, h: 860, render: renderAbout },
    focustrigger: { title: 'FocusTrigger', icon: 'tag', w: 760, h: 820, render: renderCompany },
    projects: { title: 'Projects', icon: 'folder', w: 800, h: 820, render: renderProjects },
    experience: { title: 'Experience', icon: 'case', w: 740, h: 820, render: renderExperience },
    certificates: { title: 'Certificates', icon: 'award', w: 680, h: 560, render: renderCerts },
    skills: { title: 'Skills', icon: 'chip', w: 720, h: 620, render: renderSkills },
    terminal: { title: 'Terminal', icon: 'term', w: 640, h: 440, render: renderTerminal, mount: mountTerminal },
    contact: { title: 'Contact', icon: 'mail', w: 600, h: 640, render: renderContact, mount: mountContact },
  };
  var DESKTOP_ORDER = ['about', 'focustrigger', 'projects', 'experience', 'certificates', 'skills', 'terminal', 'contact'];

  function mountContact(win) {
    var form = $('#contact-form', win.el);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.name.value.trim(), msg = form.message.value.trim();
      if (!msg) { form.message.focus(); toast('Write a message first'); return; }
      var subject = 'Hello from ' + (name || 'your portfolio');
      window.open('mailto:' + P.email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(msg + (name ? '\n\n– ' + name : '')), '_blank');
    });
  }

  /* ------------------------------------------------------------------
     Window manager
     ------------------------------------------------------------------ */
  var layer = $('#windows'), desktop = $('#desktop'), tasks = $('#tasks');
  var wins = {}, z = 10, cascade = 0;
  var mobileMQ = window.matchMedia('(max-width: 720px), (max-height: 520px)');
  function isMobile() { return mobileMQ.matches; }
  function syncMobile() { document.body.classList.toggle('is-mobile', isMobile()); }
  syncMobile();
  (mobileMQ.addEventListener ? mobileMQ.addEventListener.bind(mobileMQ, 'change') : mobileMQ.addListener.bind(mobileMQ))(syncMobile);

  function bounds() { return { w: desktop.clientWidth, h: desktop.clientHeight }; }

  function createWin(id, cfg) {
    // Phones: one full-screen app at a time, like a native app.
    if (isMobile()) Object.keys(wins).forEach(function (k) { closeWin(k, true); });
    var b = bounds();
    var w = Math.min(cfg.w || 640, b.w - 40), h = Math.min(cfg.h || 520, b.h - 30);
    var x = Math.max(10, Math.min(130 + cascade * 34, b.w - w - 10));
    var y = Math.max(10, Math.min(18 + cascade * 30, b.h - h - 10));
    cascade = (cascade + 1) % 7;

    var el = document.createElement('section');
    el.className = 'win';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', cfg.title);
    el.style.cssText = 'left:' + x + 'px;top:' + y + 'px;width:' + w + 'px;height:' + h + 'px';
    el.innerHTML =
      '<header class="win__bar">' + (cfg.parent ? '<button type="button" class="win__back" data-act="back" aria-label="Back">‹</button>' : '') +
      '<span class="win__icon">' + ICONS[cfg.icon] + '</span>' +
      '<h2 class="win__title">' + esc(cfg.title) + '</h2>' +
      '<div class="win__btns"><button type="button" data-act="min" aria-label="Minimize">_</button>' +
      '<button type="button" data-act="max" aria-label="Maximize">□</button>' +
      '<button type="button" data-act="close" aria-label="Close">×</button></div></header>' +
      '<div class="win__body">' + cfg.render() + '</div>' +
      '<div class="win__resize" aria-hidden="true"></div>';
    layer.appendChild(el);

    var task = document.createElement('button');
    task.type = 'button';
    task.className = 'task';
    task.innerHTML = ICONS[cfg.icon] + '<span>' + esc(cfg.title) + '</span>';
    task.addEventListener('click', function () {
      var wd = wins[id];
      if (wd.el.classList.contains('is-min')) { wd.el.classList.remove('is-min'); focusWin(id); }
      else if (wd.el.classList.contains('is-active')) { minimize(id); }
      else focusWin(id);
    });
    tasks.appendChild(task);

    var win = { id: id, el: el, task: task, cfg: cfg };
    wins[id] = win;

    el.addEventListener('pointerdown', function () { focusWin(id); });
    $('[data-act="close"]', el).addEventListener('click', function () { closeWin(id, true); });
    var back = $('[data-act="back"]', el);
    if (back) back.addEventListener('click', function () { closeWin(id); });
    $('[data-act="min"]', el).addEventListener('click', function (e) { e.stopPropagation(); minimize(id); });
    $('[data-act="max"]', el).addEventListener('click', function () { el.classList.toggle('is-max'); });
    $('.win__bar', el).addEventListener('dblclick', function (e) { if (!e.target.closest('button')) el.classList.toggle('is-max'); });
    makeDraggable(el, $('.win__bar', el));
    makeResizable(el, $('.win__resize', el));
    if (cfg.mount) cfg.mount(win);
    focusWin(id);
    return win;
  }

  function focusWin(id) {
    Object.keys(wins).forEach(function (k) {
      var on = k === id;
      wins[k].el.classList.toggle('is-active', on);
      wins[k].task.classList.toggle('is-active', on && !wins[k].el.classList.contains('is-min'));
    });
    if (wins[id]) wins[id].el.style.zIndex = ++z;
  }
  function minimize(id) {
    var w = wins[id]; if (!w) return;
    w.el.classList.add('is-min'); w.el.classList.remove('is-active'); w.task.classList.remove('is-active');
    var top = topWin(); if (top) focusWin(top);
  }
  function closeWin(id, toHome) {
    var w = wins[id]; if (!w) return;
    w.el.remove(); w.task.remove(); delete wins[id];
    if (isMobile() && !toHome && w.cfg.parent) { openApp(w.cfg.parent); return; }
    var top = topWin(); if (top) focusWin(top);
  }
  function topWin() {
    var best = null, bz = -1;
    Object.keys(wins).forEach(function (k) {
      var el = wins[k].el, zi = +el.style.zIndex || 0;
      if (!el.classList.contains('is-min') && zi > bz) { bz = zi; best = k; }
    });
    return best;
  }

  function openApp(id) {
    if (wins[id]) { wins[id].el.classList.remove('is-min'); focusWin(id); return wins[id]; }
    var cfg;
    if (APPS[id]) cfg = APPS[id];
    else if (id.indexOf('project:') === 0) {
      var p = window.PROJECTS.filter(function (x) { return 'project:' + x.id === id; })[0];
      if (!p) return null;
      if (p.opensCompany) return openApp('focustrigger');
      cfg = { title: p.short || p.name, icon: 'doc', w: 740, h: 800, parent: 'projects', render: function () { return renderProject(p); } };
    } else if (id.indexOf('cert:') === 0) {
      var c = window.CERTIFICATES[+id.slice(5)];
      if (!c) return null;
      cfg = { title: c.title + '.png', icon: 'image', w: 860, h: 660, parent: 'certificates', render: function () { return renderCertViewer(c); } };
    } else return null;
    return createWin(id, cfg);
  }

  function makeDraggable(el, handle) {
    var sx, sy, ox, oy, dragging = false;
    handle.addEventListener('pointerdown', function (e) {
      if (isMobile() || e.target.closest('button') || el.classList.contains('is-max') || e.button !== 0) return;
      dragging = true; sx = e.clientX; sy = e.clientY; ox = el.offsetLeft; oy = el.offsetTop;
      handle.setPointerCapture(e.pointerId);
    });
    handle.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var b = bounds();
      var nx = Math.min(Math.max(ox + e.clientX - sx, -el.offsetWidth + 80), b.w - 80);
      var ny = Math.min(Math.max(oy + e.clientY - sy, 0), b.h - 34);
      el.style.left = nx + 'px'; el.style.top = ny + 'px';
    });
    ['pointerup', 'pointercancel'].forEach(function (t) { handle.addEventListener(t, function () { dragging = false; }); });
  }
  function makeResizable(el, grip) {
    var sx, sy, ow, oh, on = false;
    grip.addEventListener('pointerdown', function (e) {
      if (isMobile()) return;
      on = true; sx = e.clientX; sy = e.clientY; ow = el.offsetWidth; oh = el.offsetHeight;
      grip.setPointerCapture(e.pointerId); e.stopPropagation();
    });
    grip.addEventListener('pointermove', function (e) {
      if (!on) return;
      el.style.width = Math.max(300, ow + e.clientX - sx) + 'px';
      el.style.height = Math.max(180, oh + e.clientY - sy) + 'px';
    });
    ['pointerup', 'pointercancel'].forEach(function (t) { grip.addEventListener(t, function () { on = false; }); });
  }

  /* Delegated actions inside windows */
  layer.addEventListener('click', function (e) {
    var t = e.target.closest('[data-open],[data-project],[data-cert],[data-copy-email]');
    if (!t) return;
    if (t.hasAttribute('data-open')) openApp(t.getAttribute('data-open'));
    else if (t.hasAttribute('data-project')) openApp('project:' + t.getAttribute('data-project'));
    else if (t.hasAttribute('data-cert')) openApp('cert:' + t.getAttribute('data-cert'));
    else if (t.hasAttribute('data-copy-email')) copyEmail();
  });

  function copyEmail() {
    var done = function () { toast('Copied ' + P.email); };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(P.email).then(done, function () { toast(P.email); });
    else toast(P.email);
  }
  var toastTimer;
  function toast(msg) {
    var old = $('.toast'); if (old) old.remove();
    var t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = msg;
    document.body.appendChild(t);
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.remove(); }, 2400);
  }

  /* ------------------------------------------------------------------
     Desktop icons
     ------------------------------------------------------------------ */
  var widget = $('#widget');
  if (widget) {
    widget.innerHTML =
      '<img src="assets/avatar.webp" alt="" width="72" height="72">' +
      '<div><p class="kicker kicker--accent">Hello, I’m</p><h1 class="widget__name">' + esc(P.name) + '</h1>' +
      '<p class="widget__line">' + esc(P.headline) + '</p></div>' +
      '<p class="focus widget__focus">' + P.focus.map(function (f) { return '<span>' + esc(f) + '</span>'; }).join('') + '</p>' +
      '<div class="btns widget__btns"><button class="btn btn--dark" data-app="about">About me</button>' +
      '<button class="btn" data-app="projects">Projects</button><button class="btn" data-app="contact">Contact</button></div>';
    widget.addEventListener('click', function (e) { var b = e.target.closest('[data-app]'); if (b) openApp(b.getAttribute('data-app')); });
  }
  var homeBtn = $('#home-btn');
  if (homeBtn) homeBtn.addEventListener('click', function () { Object.keys(wins).forEach(function (k) { closeWin(k, true); }); setMenu(false); });
  var iconsEl = $('#icons');
  iconsEl.innerHTML = DESKTOP_ORDER.map(function (id) {
    return '<button class="icon" type="button" data-app="' + id + '">' + ICONS[APPS[id].icon] + '<span>' + esc(APPS[id].title) + '</span></button>';
  }).join('');
  iconsEl.addEventListener('click', function (e) {
    var b = e.target.closest('.icon'); if (!b) return;
    $$('.icon', iconsEl).forEach(function (i) { i.classList.toggle('is-selected', i === b); });
    openApp(b.getAttribute('data-app'));
  });
  desktop.addEventListener('pointerdown', function (e) {
    if (e.target === desktop || e.target === layer) $$('.icon', iconsEl).forEach(function (i) { i.classList.remove('is-selected'); });
  });

  /* ------------------------------------------------------------------
     Start menu
     ------------------------------------------------------------------ */
  var startBtn = $('#start-btn'), menu = $('#start-menu');
  menu.innerHTML =
    '<div class="start-menu__rail">Amartya<b>OS</b></div>' +
    '<div><div class="start-menu__head"><img src="assets/avatar.webp" alt=""><div><strong>' + esc(P.name) + '</strong><span>Co-Founder & Director · FocusTrigger</span></div></div>' +
    '<ul>' + DESKTOP_ORDER.map(function (id) {
      return '<li><button class="start-menu__item" data-app="' + id + '">' + ICONS[APPS[id].icon] + esc(APPS[id].title) + '</button></li>';
    }).join('') +
    '<li class="sep"><a class="start-menu__item" href="' + esc(P.links.linkedin) + '" target="_blank" rel="noopener">' + ICONS.link + 'LinkedIn ↗</a></li>' +
    '<li><a class="start-menu__item" href="' + esc(P.links.github) + '" target="_blank" rel="noopener">' + ICONS.link + 'GitHub ↗</a></li>' +
    '<li class="sep"><button class="start-menu__item" data-shutdown>' + ICONS.power + 'Shut down…</button></li>' +
    '</ul></div>';
  function setMenu(open) {
    menu.hidden = !open; startBtn.setAttribute('aria-expanded', String(open));
    if (open) { var f = $('.start-menu__item', menu); if (f) f.focus(); }
  }
  startBtn.addEventListener('click', function () { setMenu(menu.hidden); });
  menu.addEventListener('click', function (e) {
    var a = e.target.closest('[data-app]');
    if (a) { openApp(a.getAttribute('data-app')); setMenu(false); }
    if (e.target.closest('[data-shutdown]')) { setMenu(false); shutdown(); }
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('pointerdown', function (e) {
    if (!menu.hidden && !menu.contains(e.target) && !startBtn.contains(e.target)) setMenu(false);
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); startBtn.focus(); } });

  function shutdown() {
    var s = document.createElement('div');
    s.className = 'shutdown';
    s.innerHTML = '<div>It’s now safe to close this portfolio.<p>Thanks for stopping by. Let’s build something together:<br>' + esc(P.email) + '</p>' +
      '<button class="btn btn--dark" type="button">Restart AmartyaOS</button></div>';
    document.body.appendChild(s);
    $('button', s).addEventListener('click', function () { s.remove(); Object.keys(wins).forEach(closeWin); boot(true); });
  }

  /* ------------------------------------------------------------------
     Clock (IST)
     ------------------------------------------------------------------ */
  var clock = $('#clock'), fmt;
  try { fmt = new Intl.DateTimeFormat('en-GB', { timeZone: P.timezone, hour: '2-digit', minute: '2-digit', hour12: false }); } catch (e) { fmt = null; }
  function tick() { if (fmt) { clock.textContent = fmt.format(new Date()) + ' IST'; clock.title = 'Amartya’s local time (India)'; } }
  tick(); setInterval(tick, 15000);

  /* ------------------------------------------------------------------
     Boot sequence
     ------------------------------------------------------------------ */
  var bootEl = $('#boot'), bootLog = $('#boot-log');
  var LINES = [
    ['AmartyaOS 1.0 (build 2026.11)', 'hl'],
    ['Copyright (C) 2026 Amartya Sarangee', ''],
    ['', ''],
    ['Checking memory: 16384 MB', 'ok'],
    ['Mounting /home/amartya', 'ok'],
    ['Loading FocusTrigger drivers', 'ok'],
    ['Starting fastapi, react, agents', 'ok'],
    ['Linking ' + window.PROJECTS.length + ' projects', 'ok'],
    ['', ''],
    ['Welcome, visitor.', 'hl'],
  ];
  var bootTimer = null;
  function finishBoot() {
    if (!bootEl || bootEl.classList.contains('is-done')) return;
    clearTimeout(bootTimer);
    bootEl.classList.add('is-done');
    try { sessionStorage.setItem('aos-booted', '1'); } catch (e) {}
    setTimeout(function () { if (!Object.keys(wins).length && !isMobile()) openApp('about'); }, 120);
  }
  function boot(force) {
    var seen = false;
    try { seen = sessionStorage.getItem('aos-booted') === '1'; } catch (e) {}
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    bootEl.classList.remove('is-done');
    bootLog.innerHTML = '';
    if ((seen && !force) || reduced) { finishBoot(); return; }
    var i = 0;
    (function next() {
      if (i >= LINES.length) { bootTimer = setTimeout(finishBoot, 650); return; }
      var l = LINES[i++];
      var text = esc(l[0]);
      if (l[1] === 'ok') text = '<span class="bl"><span>' + text + '</span><i></i><span class="ok">[ OK ]</span></span>';
      else if (l[1] === 'hl') text = '<span class="hl">' + text + '</span>';
      bootLog.innerHTML += (l[1] === 'ok' ? text : text + '\n');
      bootTimer = setTimeout(next, l[0] ? 110 + Math.random() * 120 : 60);
    })();
  }
  bootEl.addEventListener('click', finishBoot);
  document.addEventListener('keydown', function (e) { if (!bootEl.classList.contains('is-done') && e.key) finishBoot(); });

  // Deep links: /os/#projects, /os/#contact …
  window.addEventListener('hashchange', function () { var id = location.hash.slice(1); if (id) openApp(id); });
  boot(false);
  if (location.hash.length > 1) { finishBoot(); setTimeout(function () { openApp(location.hash.slice(1)); }, 150); }

  window.AmartyaOS = { open: openApp };
})();
