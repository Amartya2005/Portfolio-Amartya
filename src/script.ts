
/**
 * Phones get the prerendered text home page (fast, readable, crawlable).
 * Desktops, or anyone visiting /?3d, get the 3D desk. The decision is made
 * by an inline script in index.html before first paint (html.is-3d / html.is-home).
 * The 3D app is code-split so phones never download it.
 */
function addMonitorVideos() {
    const holder = document.createElement('div');
    holder.id = 'monitor-videos';
    [
        ['video-1', '/textures/monitor/video/base-static.mp4'],
        ['video-2', '/textures/monitor/video/static-texture-layer.mp4'],
    ].forEach(([id, src]) => {
        const v = document.createElement('video');
        v.id = id;
        v.src = src;
        v.muted = true;
        v.loop = true;
        v.autoplay = true;
        v.playsInline = true;
        v.width = 0;
        v.height = 0;
        v.style.opacity = '0';
        holder.appendChild(v);
    });
    document.body.appendChild(holder);
}

if (document.documentElement.classList.contains('is-3d')) {
    addMonitorVideos();
    // 3D-only styles travel with the 3D chunk, so the phone page has no extra render-blocking CSS.
    Promise.all([
        import(/* webpackChunkName: "desk3d" */ './style.css'),
        import(/* webpackChunkName: "desk3d" */ './Application/Application'),
    ]).then(([, { default: Application }]) => {
        new Application();
    });
}
