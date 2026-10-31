type MediaItem = { id: string; kind: string; uri: string; name: string };

export const revealStyles = `
  :root {
    --ink: #17163f;
    --pink: #f21c92;
    --coral: #ff735e;
    --paper: #fff9fc;
    --soft: #ffd0e7;
  }
  * { box-sizing: border-box; }
  html { -webkit-text-size-adjust: 100%; }
  body {
    margin: 0;
    min-height: 100vh;
    display: grid;
    place-items: center;
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    color: #fff;
    background: linear-gradient(145deg, #251451 0%, #7d2de0 48%, #f21c92 100%);
    background-attachment: fixed;
  }
  .frame-art {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
  }
  .frame-shade { position: fixed; inset: 0; background: linear-gradient(180deg, rgba(255,220,244,.14), rgba(62,16,100,.2)); z-index: 1; }
  .shell {
    width: min(560px, 100%);
    padding: 28px 22px 48px;
    text-align: center;
    position: relative;
    z-index: 2;
  }
  .brand {
    font-weight: 800;
    font-size: 1.05rem;
    letter-spacing: 0.02em;
    margin-bottom: 28px;
  }
  .brand span:first-child { color: #e8d9ff; }
  .brand span:last-child { color: #ffadd8; }
  .gift {
    font-size: 4.5rem;
    line-height: 1;
    filter: drop-shadow(0 12px 24px rgba(0,0,0,.25));
    animation: float 3s ease-in-out infinite;
  }
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }
  .eyebrow {
    display: inline-block;
    margin-top: 22px;
    letter-spacing: 0.16em;
    font-weight: 800;
    font-size: 0.75rem;
    color: var(--soft);
  }
  h1 {
    font-size: clamp(2rem, 7vw, 3.4rem);
    line-height: 1.15;
    margin: 14px 0 0;
    font-weight: 900;
  }
  .for {
    color: #f5d6ea;
    margin: 14px 0 0;
    font-size: 1.05rem;
  }
  .celebration {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 18px;
    min-height: 58px;
    margin-top: 12px;
  }
  .celebration span { font-size: 2rem; animation: celebrate 1.8s ease-in-out infinite; }
  .celebration span:nth-child(2) { font-size: 2.65rem; animation-delay: .18s; }
  .celebration span:nth-child(3) { animation-delay: .36s; }
  @keyframes celebrate {
    0%, 100% { transform: translateY(0) scale(1) rotate(-8deg); }
    50% { transform: translateY(-8px) scale(1.12) rotate(8deg); }
  }
  .message {
    margin: 28px auto 0;
    max-width: 36ch;
    font-size: 1.15rem;
    line-height: 1.7;
    color: #fff;
  }
  .media {
    margin: 24px 0 0;
    display: grid;
    gap: 14px;
  }
  .media img, .media video, .media audio {
    width: 100%;
    max-height: 360px;
    border-radius: 20px;
    background: rgba(0,0,0,.25);
    object-fit: cover;
  }
  .media video, .media audio { object-fit: contain; background: #1a0f33; }
  .media-note {
    margin-top: 12px;
    font-size: 0.9rem;
    color: #ffd0e7;
  }
  .card {
    margin-top: 28px;
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.22);
    backdrop-filter: blur(10px);
    border-radius: 24px;
    padding: 22px;
  }
  input, textarea, button {
    width: 100%;
    padding: 16px 18px;
    border-radius: 16px;
    border: 0;
    font-size: 1rem;
    margin-top: 12px;
    font-family: inherit;
  }
  input, textarea { background: #fff; color: var(--ink); }
  textarea { min-height: 120px; resize: vertical; }
  .wishes { margin-top: 28px; text-align: left; }
  .wishes h2 { font-size: 1.1rem; margin: 0 0 12px; text-align: center; }
  .wish {
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.22);
    border-radius: 18px;
    padding: 14px 16px;
    margin-top: 10px;
  }
  .wish strong { display: block; color: #ffd0e7; margin-bottom: 4px; }
  button {
    background: linear-gradient(90deg, var(--coral), var(--pink), #9e22e4);
    color: #fff;
    font-weight: 800;
    cursor: pointer;
  }
  button:active { transform: scale(0.98); }
  .error { color: #ffd0e7; min-height: 1.2em; margin: 8px 0 0; }
  .muted { color: #f5d6ea; line-height: 1.55; }
  .reactions {
    display: flex;
    justify-content: center;
    gap: 14px;
    margin-top: 18px;
    flex-wrap: wrap;
  }
  .reaction {
    width: 52px;
    height: 52px;
    border-radius: 16px;
    border: 1px solid rgba(255,255,255,0.28);
    background: rgba(255,255,255,0.12);
    font-size: 1.4rem;
    cursor: pointer;
    display: grid;
    place-items: center;
  }
  .footer {
    margin-top: 36px;
    font-size: 0.8rem;
    color: rgba(255,255,255,0.65);
  }
  .public-shell { width: min(1600px, 100%); padding: 0; text-align: left; }
  .public-shell > .brand { position: fixed; top: 24px; left: 42px; z-index: 5; color: #24164a; font-size: 1.25rem; margin: 0; text-shadow: 0 2px 16px rgba(255,255,255,.85); }
  .surprise-app { position: relative; min-height: 100vh; overflow: hidden; color: #24164a; background: linear-gradient(145deg, rgba(255,243,250,.88), rgba(244,229,255,.88) 48%, rgba(255,242,247,.9)); }
  .surprise-app.has-frame { background: radial-gradient(circle at 15% 20%, rgba(255,255,255,.88), transparent 30%), radial-gradient(circle at 85% 25%, rgba(255,199,229,.9), transparent 28%), linear-gradient(145deg, #fff5fb 0%, #f5e9ff 52%, #ffe8f3 100%); }
  .surprise-app .frame-art { position: fixed; opacity: .14; filter: saturate(1.12) blur(0); transition: opacity .3s ease; }
  html[data-view="landing"] .surprise-app .frame-art { opacity: .08; }
  .surprise-app .frame-shade { position: fixed; background: linear-gradient(180deg, rgba(255,246,252,.12), rgba(255,223,242,.28)); }
  html[data-view="landing"] .surprise-app .frame-shade { background: linear-gradient(180deg, rgba(255,246,252,.08), rgba(255,223,242,.2)); }
  .public-topbar { position: fixed; top: 16px; right: 28px; z-index: 4; display: flex; gap: 12px; }
  .public-pill { border: 0; border-radius: 999px; padding: 13px 22px; width: auto; margin: 0; background: rgba(255,255,255,.9); color: #7526d9; font-weight: 800; }
  .public-view { position: relative; z-index: 2; min-height: 100vh; padding: 110px 5vw 54px; text-align: center; }
  .public-view[hidden] { display: none; }
  .landing-title { max-width: 980px; margin: 46px auto 0; color: #24104f; font-size: clamp(3.4rem, 8vw, 8rem); line-height: .92; letter-spacing: -.065em; font-weight: 950; text-shadow: 0 8px 28px rgba(255,255,255,.5); }
  .landing-title span { display: block; color: #ed1c83; }
  .landing-copy { max-width: 700px; margin: 26px auto 0; color: #24104f; font-size: 1.25rem; line-height: 1.45; }
  .landing-stats { display: flex; justify-content: center; gap: 14px; margin: 38px auto; flex-wrap: wrap; }
  .stat-card { min-width: 150px; padding: 16px 24px; border: 1px solid rgba(255,255,255,.85); border-radius: 20px; background: rgba(255,255,255,.56); box-shadow: 0 12px 26px rgba(93,27,145,.1); }
  .stat-card strong { display: block; color: #34116f; font-size: 2rem; }
  .stat-card small { color: #746f86; font-size: .95rem; }
  .public-cta { width: auto; min-width: 260px; margin: 0; padding: 17px 28px; border-radius: 999px; font-size: 1.08rem; }
  .view-heading { max-width: 1100px; margin: 0 auto 26px; text-align: center; }
  .view-heading h1 { color: #24104f; font-size: clamp(2.4rem, 6vw, 5rem); }
  .view-heading p { color: #4e3675; font-size: 1.1rem; }
  .view-tabs { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin: 20px auto 34px; }
  .view-tabs a { width: auto; margin: 0; padding: 12px 20px; border-radius: 999px; color: #3a176f; background: rgba(255,255,255,.7); text-decoration: none; font-weight: 750; }
  .view-tabs a.active { color: #fff; background: linear-gradient(90deg, #f21c92, #7526d9); }
  .wish-grid, .memory-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; max-width: 1460px; margin: 0 auto; text-align: left; }
  .wish-card, .memory-card { min-height: 210px; padding: 20px; border: 1px solid rgba(255,255,255,.92); border-radius: 22px; background: rgba(255,255,255,.76); box-shadow: 0 14px 28px rgba(93,27,145,.1); backdrop-filter: blur(10px); }
  .wish-card strong { display: block; color: #25104e; font-size: 1.05rem; }
  .wish-card small, .memory-card small { color: #79698f; }
  .wish-card p { color: #3d2862; line-height: 1.45; }
  .wish-card img { width: 100%; height: 110px; margin-top: 10px; border-radius: 14px; object-fit: cover; }
  .memory-grid { grid-template-columns: repeat(5, minmax(0, 1fr)); align-items: start; }
  .memory-card { padding: 0; overflow: hidden; min-height: 220px; }
  .memory-card img { display: block; width: 100%; height: 185px; object-fit: cover; }
  .memory-card small { display: block; padding: 10px 12px; }
  .thanks-card { max-width: 760px; margin: 30px auto 0; padding: 32px; border: 1px solid rgba(255,255,255,.9); border-radius: 28px; background: rgba(255,255,255,.74); box-shadow: 0 20px 50px rgba(93,27,145,.16); }
  .share-row { display:flex; justify-content:center; gap:12px; flex-wrap:wrap; margin-top:22px; }
  .share-row button { width:auto; margin:0; padding:12px 18px; background:rgba(255,255,255,.86); color:#5f27c8; border:1px solid rgba(117,38,217,.16); }
  .search-box { max-width:560px; margin:0 auto 24px; }
  .thanks-card textarea { min-height: 160px; background: rgba(255,255,255,.9); }
  @media (max-width: 900px) { .wish-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } .memory-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
  @media (max-width: 600px) { .public-shell > .brand { position: absolute; top: 18px; left: 20px; } .public-topbar { top: 12px; right: 12px; } .public-pill { padding: 10px 14px; font-size:.85rem; } .public-view { padding: 92px 14px 30px; } .landing-title { font-size: 3.2rem; } .landing-cta { min-width: 220px; } .wish-grid, .memory-grid { grid-template-columns: 1fr; } .memory-card img { height: 220px; } .stat-card { min-width: 112px; padding: 12px; } }
  /* Surprise experience rebuild */
  .public-shell .footer { display:none; }
  .public-shell { max-width:none; min-height:100vh; }
  .surprise-app { min-height:100vh; background:linear-gradient(145deg,#fff1f8 0%,#f3e7ff 52%,#ffe9f1 100%); }
  .surprise-app.has-frame { background:linear-gradient(145deg,#fff1f8 0%,#f3e7ff 52%,#ffe9f1 100%); }
  .surprise-app .frame-art, .surprise-app .frame-shade { display:none; }
  .surprise-app:before, .surprise-app:after { content:""; position:fixed; z-index:0; pointer-events:none; border-radius:50%; filter:blur(3px); }
  .surprise-app:before { width:38vw; height:38vw; left:-14vw; top:10vh; background:radial-gradient(circle at 35% 30%,#ff91be, #a86cff 70%,transparent 71%); opacity:.25; }
  .surprise-app:after { width:40vw; height:40vw; right:-18vw; bottom:-12vh; background:radial-gradient(circle at 45% 45%,#ffbc9a,#ff46a6 68%,transparent 69%); opacity:.2; }
  .public-shell > .brand { position:fixed; top:22px; left:42px; color:#2d145f; font-size:1.55rem; letter-spacing:-.04em; }
  .public-shell > .brand span:first-child { color:#35105f; } .public-shell > .brand span:last-child { color:#ef258c; }
  .public-topbar { position:fixed; top:18px; right:32px; }
  .public-pill { box-shadow:0 12px 24px rgba(91,30,146,.12); color:#6b21c5; }
  .public-view { padding:112px clamp(18px,5vw,80px) 70px; }
  .landing-view { display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh; overflow:hidden; }
  .landing-view:before { content:"🎈  💜  🎈"; position:absolute; top:15%; left:4%; font-size:clamp(2rem,5vw,5rem); opacity:.75; transform:rotate(-12deg); letter-spacing:24px; }
  .landing-view:after { content:"🎁  💗  ✨"; position:absolute; right:4%; bottom:14%; font-size:clamp(2rem,5vw,5rem); opacity:.72; transform:rotate(10deg); letter-spacing:16px; }
  .landing-view > * { position:relative; z-index:1; }
  .hero-bear { position:absolute; z-index:1; left:4%; bottom:8%; font-size:clamp(5rem,13vw,12rem); filter:drop-shadow(0 20px 22px rgba(102,34,120,.2)); transform:rotate(-4deg); }
  .hero-bear span { position:absolute; left:42%; top:44%; font-size:clamp(2rem,4vw,4rem); }
  .hero-scrap { position:absolute; z-index:1; right:4%; top:24%; display:grid; gap:14px; transform:rotate(4deg); }
  .hero-scrap img { width:clamp(90px,10vw,150px); height:clamp(90px,10vw,150px); object-fit:cover; padding:8px; background:#fff; box-shadow:0 12px 20px rgba(67,22,92,.18); }
  .landing-gift { font-size:clamp(3rem,6vw,5.5rem); margin-bottom:4px; }
  .landing-view-eyebrow { padding:9px 18px; border-radius:999px; background:rgba(123,47,247,.1); color:#7b2ff7; letter-spacing:.18em; }
  .landing-title { max-width:1000px; margin:22px auto 0; font-family:"Trebuchet MS",cursive; font-size:clamp(3.2rem,7vw,7rem); line-height:.96; letter-spacing:-.07em; text-align:center; color:#35105f; text-shadow:0 8px 24px rgba(123,47,247,.13); }
  .landing-title span { display:block; color:#ef258c; }
  .landing-copy { max-width:650px; margin:24px auto 0; color:#563d76; font-size:clamp(1rem,1.6vw,1.3rem); text-align:center; line-height:1.5; }
  .landing-stats { margin:34px auto 26px; }
  .stat-card { min-width:170px; padding:17px 25px; border-radius:24px; background:rgba(255,255,255,.65); border:1px solid rgba(255,255,255,.95); box-shadow:0 16px 32px rgba(100,32,150,.12); }
  .stat-card strong { color:#4d1599; font-size:2rem; }
  .public-cta { background:linear-gradient(100deg,#ff725e,#f21c92 52%,#7b2ff7); box-shadow:0 14px 28px rgba(232,35,141,.25); }
  .landing-cta { min-width:320px; font-size:1.1rem; }
  .landing-scroll { color:#7c6c91; font-size:.95rem; margin-top:38px; }
  .view-heading { max-width:1200px; }
  .view-heading h1 { font-family:"Trebuchet MS",cursive; font-size:clamp(2.8rem,6vw,5.8rem); letter-spacing:-.06em; color:#35105f; }
  .view-heading p { color:#6a5681; }
  .view-tabs { padding:9px; border-radius:999px; background:rgba(255,255,255,.54); border:1px solid rgba(255,255,255,.9); box-shadow:0 10px 24px rgba(88,37,143,.08); }
  .view-tabs a { padding:13px 20px; color:#432167; }
  .view-tabs a.active { background:linear-gradient(100deg,#f21c92,#7b2ff7); box-shadow:0 8px 18px rgba(123,47,247,.22); }
  .search-box input { margin:0; border:1px solid rgba(123,47,247,.14); box-shadow:0 8px 18px rgba(93,27,145,.07); }
  .wish-grid { grid-template-columns:repeat(4,minmax(0,1fr)); }
  .wish-card { min-height:230px; background:rgba(255,255,255,.72); border:1px solid rgba(255,255,255,.95); box-shadow:0 16px 28px rgba(91,30,146,.1); }
  .wish-card:nth-child(3n) { background:linear-gradient(145deg,rgba(255,247,252,.86),rgba(239,224,255,.74)); transform:translateY(10px); }
  .wish-card:nth-child(4n) { border-radius:30px 18px 30px 18px; }
  .wish-card p { font-size:1rem; }
  .memory-grid { grid-template-columns:repeat(5,minmax(0,1fr)); gap:18px; }
  .memory-card { background:rgba(255,255,255,.76); border-radius:22px; box-shadow:0 14px 28px rgba(91,30,146,.1); }
  .memory-card:nth-child(3n) { transform:rotate(-1.2deg); } .memory-card:nth-child(4n) { transform:rotate(1.2deg); }
  .memory-card img { height:220px; }
  .media-badge { position:absolute; top:12px; right:12px; background:rgba(43,18,85,.72); color:#fff; padding:7px 10px; border-radius:999px; font-size:.78rem; }
  .memory-card { position:relative; cursor:pointer; }
  .memory-card video { width:100%; height:220px; object-fit:cover; display:block; }
  .thanks-card { max-width:760px; background:rgba(255,255,255,.76); }
  .thanks-card h2 { color:#35105f; font-family:"Trebuchet MS",cursive; font-size:2rem; }
  .share-row button { background:rgba(255,255,255,.9); }
  .lightbox { position:fixed; inset:0; z-index:20; display:none; align-items:center; justify-content:center; padding:28px; background:rgba(27,10,58,.82); }
  .lightbox.open { display:flex; } .lightbox img,.lightbox video { max-width:94vw; max-height:86vh; border-radius:20px; box-shadow:0 20px 60px rgba(0,0,0,.35); }
  .lightbox-close { position:absolute; top:22px; right:26px; width:auto; margin:0; padding:10px 16px; background:#fff; color:#35105f; }
  @media (max-width:1100px) { .wish-grid { grid-template-columns:repeat(2,minmax(0,1fr)); } .memory-grid { grid-template-columns:repeat(3,minmax(0,1fr)); } }
  @media (max-width:650px) {
    body { display:block; }
    .public-shell > .brand { position:absolute; top:16px; left:18px; font-size:1.2rem; }
    .public-topbar { position:absolute; top:62px; right:12px; gap:8px; }
    .public-pill { padding:10px 13px; font-size:.82rem; }
    .public-view { min-height:auto; padding:142px 16px 42px; }
    .landing-view { min-height:100svh; justify-content:flex-start; padding-top:160px; }
    .landing-view:before { top:118px; left:50%; transform:translateX(-50%) rotate(-8deg); font-size:2rem; letter-spacing:10px; white-space:nowrap; }
    .landing-view:after, .hero-bear, .hero-scrap { display:none; }
    .landing-gift { font-size:3.6rem; margin-bottom:10px; }
    .landing-view-eyebrow { margin-top:0; padding:8px 14px; font-size:.68rem; }
    .landing-title { width:100%; max-width:360px; margin:18px auto 0; font-size:clamp(2.25rem,11vw,3rem); line-height:1; letter-spacing:-.06em; overflow-wrap:anywhere; }
    .landing-copy { max-width:340px; margin-top:18px; font-size:1rem; line-height:1.42; }
    .landing-stats { width:100%; gap:8px; margin:24px auto; flex-wrap:nowrap; }
    .stat-card { min-width:0; flex:1; padding:11px 5px; border-radius:17px; }
    .stat-card strong { font-size:1.45rem; } .stat-card small { font-size:.72rem; }
    .public-cta, .landing-cta { width:100%; min-width:0; font-size:1rem; padding:15px 16px; }
    .landing-scroll { margin-top:22px; }
    .wish-grid,.memory-grid { grid-template-columns:1fr; }
    .wish-card:nth-child(3n),.memory-card:nth-child(3n),.memory-card:nth-child(4n) { transform:none; }
    .view-heading h1 { font-size:clamp(2.25rem,11vw,3.25rem); }
    .view-tabs { border-radius:22px; gap:6px; padding:7px; margin-bottom:24px; }
    .view-tabs a { padding:9px 10px; font-size:.78rem; }
    .thanks-card { padding:20px 16px; border-radius:22px; }
    .share-row { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
    .share-row button { width:100%; padding:11px 8px; font-size:.88rem; }
  }
  @media (max-width:360px) { .landing-title { font-size:2.15rem; } .public-pill { padding:9px 10px; } .landing-view { padding-left:12px; padding-right:12px; } }
`;

const csp =
  "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https: http:; media-src 'self' https: http:; connect-src 'self'; base-uri 'self'; form-action 'self'";

function isPlayableUri(uri: string) {
  return /^https?:\/\//i.test(uri);
}

// LAN addresses can change between development sessions. Public reveal pages are
// served by the same API that owns local /media files, so keep those URLs relative.
function publicMediaUri(uri: string) {
  try {
    const parsed = new URL(uri);
    if (/^192\.168\.\d{1,3}\.\d{1,3}$/.test(parsed.hostname) && parsed.port === '3001' && parsed.pathname.startsWith('/media/')) {
      return `${parsed.pathname}${parsed.search}`;
    }
  } catch {
    /* Leave malformed or non-URL values to the existing media validation. */
  }
  return uri;
}

export function renderMediaHtml(media: MediaItem[] = []) {
  if (!media.length) return '';
  const playable = media.filter(item => isPlayableUri(item.uri));
  if (!playable.length) {
    return `<p class="media-note">${media.length} photo/video attached on the creator’s device, but not uploaded to the cloud yet — recreate the surprise after updating the app to see media here.</p>`;
  }
  const items = playable
    .map(item => {
      const src = escape(publicMediaUri(item.uri));
      if (item.kind === 'video') {
        return `<video controls playsinline preload="metadata" src="${src}"></video>`;
      }
      if (item.kind === 'audio' || item.kind === 'music') {
        return `<audio controls src="${src}"></audio>`;
      }
      return `<img src="${src}" alt="${escape(item.name || 'Surprise photo')}" />`;
    })
    .join('');
  return `<div class="media">${items}</div>`;
}

export type WishItem = { authorName: string; message: string; media?: MediaItem[]; createdAt?: string };

const animationSymbols: Record<string, readonly string[]> = {
  fireworks: ['🎆', '✨', '🎇'],
  hearts: ['💗', '💕', '💖'],
  butterflies: ['🦋', '🦋', '✨'],
  confetti: ['🎊', '🎉', '✨'],
  sparkles: ['✨', '⭐', '💫'],
  none: [],
};

export function renderAnimationHtml(animation?: string) {
  const symbols = animationSymbols[animation ?? 'hearts'] ?? animationSymbols.hearts;
  if (!symbols.length) return '';
  return `<div class="celebration" aria-label="${escape(animation ?? 'hearts')} celebration">${symbols.map(symbol => `<span aria-hidden="true">${symbol}</span>`).join('')}</div>`;
}

export function renderWishesHtml(wishes: WishItem[] = []) {
  if (!wishes.length) return '';
  const items = wishes
    .map(
      wish =>
        `<div class="wish"><strong>${escape(wish.authorName)}</strong>${escape(wish.message).replace(/\n/g, '<br>')}</div>`,
    )
    .join('');
  return `<div class="wishes"><h2>Messages from your people (${wishes.length})</h2>${items}</div>`;
}

export function htmlPage(title: string, body: string, script = '', extraHead = '') {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="theme-color" content="#7526d9" />
  <title>${title}</title>
  ${extraHead}
  <style>${revealStyles}</style>
</head>
<body>
  <div class="shell${body.includes('class="contribute"') ? ' contribute-shell' : ''}${body.includes('surprise-app') ? ' public-shell' : ''}">
    <div class="brand"><span>Wish</span><span>Drop</span></div>
    ${body}
    <p class="footer">Made with WishDrop · lives only for a little while</p>
  </div>
  ${script ? `<script>${script}</script>` : ''}
</body>
</html>`;
}

export function unavailablePage() {
  return htmlPage(
    'Unavailable · WishDrop',
    `<div class="gift">⏳</div>
     <span class="eyebrow">WISHDROP</span>
     <h1>This surprise isn’t available</h1>
     <p class="muted">It may not be open yet, or its reveal window has ended.</p>`,
  );
}

export function openRevealPage(surprise: {
  title: string;
  occasion: string;
  recipientName: string;
  message: string;
  allowWishes?: boolean;
  media?: MediaItem[];
  wishes?: WishItem[];
  animation?: string;
  frameImageUrl?: string;
  thankYouMessage?: string;
}) {
  const allMedia = [...(surprise.media ?? []), ...(surprise.wishes ?? []).flatMap(wish => wish.media ?? [])].filter(item => isPlayableUri(item.uri));
  const wishCount = surprise.wishes?.length ?? 0;
  const photoCount = allMedia.filter(item => item.kind === 'image').length;
  const peopleCount = new Set((surprise.wishes ?? []).map(wish => wish.authorName)).size;
  const nav = (view: string, label: string, active = false) => `<a class="${active ? 'active' : ''}" href="?view=${view}">${label}</a>`;
  const stats = `<div class="landing-stats"><div class="stat-card"><strong>💗 ${wishCount}</strong><small>Wishes</small></div><div class="stat-card"><strong>▧ ${photoCount}</strong><small>Photos</small></div><div class="stat-card"><strong>♣ ${peopleCount}</strong><small>People</small></div></div>`;
  const wishCards = (surprise.wishes ?? []).map((wish, index) => {
    const image = wish.media?.find(item => item.kind === 'image' && isPlayableUri(item.uri));
    const initials = escape(wish.authorName.trim().slice(0, 2).toUpperCase() || '♡');
    return `<article class="wish-card" data-kind="message${image ? ' photo' : ''}" data-search="${escape(`${wish.authorName} ${wish.message}`)}"><div style="display:flex;align-items:center;gap:10px"><span style="display:grid;place-items:center;width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,#f21c92,#7526d9);color:#fff;font-weight:800">${initials}</span><div><strong>${escape(wish.authorName)}</strong><small>${escape(wish.createdAt ? new Date(wish.createdAt).toLocaleString() : 'A little while ago')}</small></div><button class="card-menu" type="button" aria-label="More options">⋮</button></div><p>${escape(wish.message).replace(/\n/g, '<br>')}</p>${image ? `<img src="${escape(publicMediaUri(image.uri))}" alt="${escape(image.name || 'Wish photo')}" />` : ''}<div style="display:flex;gap:16px;color:#7c5a98;margin-top:14px"><span>♥ ${index + 1}</span><span>◌ ${Math.max(1, index % 4)}</span><span style="color:#ed1c83">✨</span></div></article>`;
  }).join('');
  const memoryCards = allMedia.map((item, index) => item.kind === 'video'
    ? `<article class="memory-card" data-search="${escape(item.name || 'Video memory')}"><video controls playsinline preload="metadata" src="${escape(publicMediaUri(item.uri))}"></video><small>Memory ${index + 1} · Video</small></article>`
    : `<article class="memory-card" data-search="${escape(item.name || 'Photo memory')}" data-lightbox="${escape(publicMediaUri(item.uri))}"><img src="${escape(publicMediaUri(item.uri))}" alt="${escape(item.name || 'Surprise memory')}" /><small>Memory ${index + 1} · Shared photo</small></article>`).join('');
  const heroPhotos = allMedia.filter(item => item.kind === 'image').slice(0, 2);
  const landing = `<section class="public-view landing-view" data-view="landing"><div class="public-topbar"><button class="public-pill" id="music">♫ &nbsp; Play Music</button><button class="public-pill" onclick="show('wishes')">•••</button></div><div class="hero-bear" aria-hidden="true">🧸<span>💗</span></div><div class="hero-scrap" aria-label="Shared memories">${heroPhotos.map(item => `<img src="${escape(publicMediaUri(item.uri))}" alt="${escape(item.name || 'Shared memory')}" />`).join('')}</div><div class="gift landing-gift">🎁</div><span class="eyebrow landing-view-eyebrow">${escape(surprise.occasion).toUpperCase()}</span><h1 class="landing-title">${escape(surprise.recipientName)}’s <span>${escape(surprise.occasion)} Surprise</span></h1><p class="landing-copy">A collection of lovely wishes, memories and messages from your friends and family</p>${stats}<button class="public-cta landing-cta" onclick="show('wishes')">Explore Your Wishes &nbsp; →</button><p class="landing-scroll">↓ &nbsp; Scroll to see all wishes</p></section>`;
  const viewHeader = (title: string, subtitle: string, active: string) => `<div class="view-heading"><h1>${title}</h1><p>${subtitle}</p></div><nav class="view-tabs">${nav('landing', '♡ Home', active === 'landing')}${nav('wishes', `▦ All Wishes (${wishCount})`, active === 'wishes')}${nav('gallery', `▧ Memories (${photoCount})`, active === 'gallery')}${nav('thanks', '♡ Thank You', active === 'thanks')}</nav>`;
  const wishesView = `<section class="public-view" data-view="wishes">${viewHeader(`All ${escape(surprise.occasion)} Wishes<br>for ${escape(surprise.recipientName)} 💗`, 'So much love from amazing people like you!', 'wishes')}<div class="search-box"><input id="wish-search" type="search" placeholder="⌕  Search wishes by name or message..." aria-label="Search wishes" /></div><div class="view-tabs secondary-tabs"><a href="#" class="active" data-filter="all">▦ All Wishes</a><a href="#" data-filter="message">◌ Messages</a><a href="#" data-filter="photo">▧ Photos</a><a href="#" data-filter="all">⌂ From Family</a><a href="#" data-filter="all">♧ From Friends</a><a href="#" data-filter="all">▣ From Colleagues</a></div><div class="wish-grid" id="wish-grid">${wishCards || '<p class="muted">Your wishes will appear here.</p>'}</div></section>`;
  const galleryView = `<section class="public-view" data-view="gallery">${viewHeader(`${escape(surprise.recipientName)}’s<br>Memories Gallery`, 'Moments captured with love by your amazing people 💗', 'gallery')}<div class="search-box"><input id="memory-search" type="search" placeholder="⌕  Search memories..." aria-label="Search memories" /></div><div class="view-tabs secondary-tabs"><a href="#" class="active" data-memory-filter="all">▦ All Memories</a><a href="#" data-memory-filter="image">▧ Photos</a><a href="#" data-memory-filter="video">▶ Videos</a><a href="#" data-memory-filter="all">⌂ From Family</a><a href="#" data-memory-filter="all">♧ From Friends</a><a href="#" data-memory-filter="all">▣ From Colleagues</a></div><div class="memory-grid" id="memory-grid">${memoryCards || '<p class="muted">Memories will appear here.</p>'}</div></section>`;
  const thanksView = `<section class="public-view" data-view="thanks">${viewHeader('Thank You<br><span style="color:#ed1c83">Everyone!</span> 💗', 'You made this surprise feel extra special.', 'thanks')}${stats}<div class="thanks-card"><h2>My Message to You All</h2><p class="muted">Share a thank-you message with everyone who wished you.</p><textarea id="thanks-message" maxlength="500" placeholder="Write your thank-you message here..."></textarea><div style="text-align:right;color:#8a709f" id="thanks-count">0/500</div><button class="public-cta" id="thanks-submit">➤ &nbsp; Send Thank You Message</button><p id="thanks-status" class="error"></p><div class="share-row"><button type="button" onclick="window.open('https://wa.me/?text='+encodeURIComponent(location.href),'_blank')">🟢 WhatsApp</button><button type="button" onclick="navigator.clipboard?.writeText(location.href)">🔗 Copy Link</button><button type="button" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(location.href),'_blank')">ⓕ Facebook</button><button type="button" onclick="navigator.share?.({title:document.title,url:location.href})">◎ More</button></div><p style="color:#b03d82;font-family:cursive;font-size:1.1rem;margin-top:24px">“Grateful for every wish, every message, every amazing person in my life.”</p></div></section>`;

  const publishedThanks = surprise.thankYouMessage
    ? `<aside style="max-width:760px;margin:20px auto;padding:18px 22px;border-radius:18px;background:#fff0f8;color:#35105f;text-align:center"><strong>A thank-you message for everyone 💗</strong><p style="margin:9px 0 0;white-space:pre-wrap">${escape(surprise.thankYouMessage)}</p></aside>`
    : '';

  return {
    csp,
    html: htmlPage(
      `${escape(surprise.title)} · WishDrop`,
      `<main class="surprise-app has-frame">${publishedThanks}<div id="public-views">${landing}${wishesView}${galleryView}${thanksView}</div><div class="lightbox" id="lightbox"><button class="lightbox-close" type="button" id="lightbox-close">Close</button><img id="lightbox-image" alt="Expanded memory" /></div></main>`,
      `const views=document.querySelectorAll('[data-view]');const show=v=>{document.documentElement.dataset.view=v;views.forEach(el=>el.hidden=el.dataset.view!==v);history.replaceState(null,'','?view='+v);window.scrollTo({top:0,behavior:'smooth'})};window.show=show;show(new URLSearchParams(location.search).get('view')||'landing');document.querySelectorAll('.view-tabs a:not([data-filter]):not([data-memory-filter])').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();show(new URL(a.href).searchParams.get('view')||'landing')}));const filter=(input,selector,attr)=>input?.addEventListener('input',()=>{const q=input.value.toLowerCase();document.querySelectorAll(selector).forEach(card=>card.style.display=(card.getAttribute(attr)||card.textContent||'').toLowerCase().includes(q)?'':'none')});filter(document.getElementById('wish-search'),'#wish-grid .wish-card','data-search');filter(document.getElementById('memory-search'),'#memory-grid .memory-card','data-search');document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',e=>{e.preventDefault();document.querySelectorAll('[data-filter]').forEach(x=>x.classList.remove('active'));button.classList.add('active');const kind=button.dataset.filter;document.querySelectorAll('#wish-grid .wish-card').forEach(card=>card.style.display=kind==='all'||(card.dataset.kind||'').includes(kind)?'':'none')}));document.querySelectorAll('[data-memory-filter]').forEach(button=>button.addEventListener('click',e=>{e.preventDefault();document.querySelectorAll('[data-memory-filter]').forEach(x=>x.classList.remove('active'));button.classList.add('active');const kind=button.dataset.memoryFilter;document.querySelectorAll('#memory-grid .memory-card').forEach(card=>card.style.display=kind==='all'||(card.querySelector('video')?'video':'image')===kind?'':'none')}));document.querySelectorAll('[data-lightbox]').forEach(card=>card.addEventListener('click',()=>{document.getElementById('lightbox-image').src=card.dataset.lightbox;document.getElementById('lightbox').classList.add('open')}));document.getElementById('lightbox-close').addEventListener('click',()=>document.getElementById('lightbox').classList.remove('open'));document.getElementById('thanks-message')?.addEventListener('input',e=>document.getElementById('thanks-count').textContent=e.target.value.length+'/500');document.getElementById('thanks-submit')?.addEventListener('click',async()=>{const message=document.getElementById('thanks-message').value.trim();const status=document.getElementById('thanks-status');if(!message){status.textContent='Write a message first.';return}status.textContent='Sending…';const token=location.pathname.split('/').pop();try{const res=await fetch('/v1/public/surprises/'+token+'/reactions',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({emoji:'💗',message})});if(!res.ok)throw new Error('Request failed');status.textContent='Thank-you message sent!';document.getElementById('thanks-message').value='';document.getElementById('thanks-count').textContent='0/500'}catch(error){status.textContent='Could not send your message. Please try again.'}});document.getElementById('music')?.addEventListener('click',()=>{document.getElementById('music').textContent='♫ Music coming soon';});`,
    ),
  };
}

export function pinRevealPage(token: string) {
  const script = `
    document.getElementById('pin-form').addEventListener('submit', async e => {
      e.preventDefault();
      const pin = document.getElementById('pin').value;
      const error = document.getElementById('error');
      error.textContent = '';
      const response = await fetch('/v1/public/surprises/${token}', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin })
      });
      if (!response.ok) {
        error.textContent = 'That PIN is not correct. Try again.';
        return;
      }
      const { surprise } = await response.json();
      const main = document.getElementById('reveal');
      const media = Array.isArray(surprise.media) ? surprise.media : [];
      const playable = media.filter(item => /^https?:\\/\\//i.test(item.uri || ''));
      let mediaHtml = '';
      if (playable.length) {
        mediaHtml = '<div class="media">' + playable.map(item => {
          const src = String(item.uri).replace(/"/g, '&quot;');
          if (item.kind === 'video') return '<video controls playsinline preload="metadata" src="' + src + '"></video>';
          if (item.kind === 'audio' || item.kind === 'music') return '<audio controls src="' + src + '"></audio>';
          return '<img src="' + src + '" alt="" />';
        }).join('') + '</div>';
      } else if (media.length) {
        mediaHtml = '<p class="media-note">Media was attached but is not available on this link.</p>';
      }
      main.innerHTML = \`
        <div class="gift">🎁</div>
        <span class="eyebrow"></span>
        <h1></h1>
        <div class="celebration" hidden></div>
        <p class="for"></p>
        \${mediaHtml}
        <p class="message"></p>
      \`;
      main.querySelector('.eyebrow').textContent = surprise.occasion.toUpperCase();
      main.querySelector('h1').textContent = surprise.title;
      const animationSymbols = {
        fireworks: ['🎆', '✨', '🎇'], hearts: ['💗', '💕', '💖'], butterflies: ['🦋', '🦋', '✨'],
        confetti: ['🎊', '🎉', '✨'], sparkles: ['✨', '⭐', '💫'], none: []
      };
      const symbols = animationSymbols[surprise.animation] || animationSymbols.hearts;
      const celebration = main.querySelector('.celebration');
      celebration.hidden = !symbols.length;
      celebration.innerHTML = symbols.map(symbol => '<span aria-hidden="true">' + symbol + '</span>').join('');
      main.querySelector('.for').textContent = 'Made especially for ' + surprise.recipientName;
      main.querySelector('.message').textContent = surprise.message;
      const wishes = Array.isArray(surprise.wishes) ? surprise.wishes : [];
      if (wishes.length) {
        const list = document.createElement('div');
        list.className = 'wishes';
        const heading = document.createElement('h2');
        heading.textContent = 'Messages from your people (' + wishes.length + ')';
        list.appendChild(heading);
        wishes.forEach(wish => {
          const item = document.createElement('div');
          item.className = 'wish';
          const author = document.createElement('strong');
          author.textContent = wish.authorName;
          item.appendChild(author);
          item.appendChild(document.createTextNode(wish.message));
          list.appendChild(item);
        });
        main.appendChild(list);
      }
    });
  `;

  return {
    csp,
    html: htmlPage(
      'PIN required · WishDrop',
      `<div id="reveal">
         <div class="gift">🔒</div>
         <span class="eyebrow">WISHDROP SURPRISE</span>
         <h1>Enter the PIN</h1>
         <p class="muted">The creator protected this moment with a PIN.</p>
         <p id="error" class="error" aria-live="polite"></p>
         <form id="pin-form" class="card">
           <input id="pin" type="password" inputmode="numeric" minlength="4" maxlength="12" placeholder="4–12 character PIN" required autofocus />
           <button type="submit">Open surprise</button>
         </form>
       </div>`,
      script,
    ),
  };
}

export function escape(value: string) {
  return value.replace(/[&<>'"]/g, character =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] ?? character,
  );
}

export { csp as revealCsp };
