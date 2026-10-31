import { escape, htmlPage } from './reveal-page.js';
const contributeStyles = `
  .contribute-shell { width: min(920px, 100%); padding-left: 22px; padding-right: 22px; }
  .contribute { position: relative; }
  .contribute::before, .contribute::after { content: ''; position: fixed; border-radius: 999px; pointer-events: none; filter: blur(2px); opacity: .72; z-index: -1; }
  .contribute::before { width: 180px; height: 240px; background: radial-gradient(circle at 62% 32%, #ffc0ed 0 12%, #e44cc8 26%, #7d29ce 70%); top: 34px; left: -82px; }
  .contribute::after { width: 220px; height: 290px; background: radial-gradient(circle at 38% 28%, #ffd1e5 0 13%, #fa7eb6 31%, #8b2bd8 74%); right: -116px; top: 54px; }
  .contribute .gift { display: none; }
  .contribute .occasion { display: inline-flex; align-items: center; gap: 8px; margin-top: 10px; padding: 10px 20px; border-radius: 999px; background: rgba(255,255,255,.16); border: 1px solid rgba(255,255,255,.16); color: #fff; font-size: .82rem; font-weight: 900; letter-spacing: .1em; }
  .contribute h1 { font-size: clamp(2.65rem, 10vw, 4.7rem); max-width: 760px; margin: 26px auto 0; letter-spacing: -.045em; }
  .contribute h1 span { display: block; color: #ff98c9; text-shadow: 0 4px 20px rgba(255,104,189,.32); }
  .contribute .muted { max-width: 620px; margin: 22px auto 0; font-size: clamp(1rem, 3.5vw, 1.25rem); color: #fff0f8; }
  .contribute .card { max-width: 830px; margin: 42px auto 0; padding: 34px 38px; border-radius: 30px; background: rgba(255,255,255,.17); border-color: rgba(255,255,255,.28); box-shadow: 0 24px 54px rgba(37, 8, 90, .28); }
  .contribute .field { position: relative; }
  .contribute .field svg { position: absolute; z-index: 1; left: 22px; top: 50%; transform: translateY(-50%); width: 26px; height: 26px; fill: none; stroke: #716795; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; pointer-events: none; }
  .contribute .field.textarea-field svg { top: 28px; transform: none; }
  .contribute input:not([type=file]), .contribute textarea { margin-top: 14px; border: 1px solid rgba(112,70,163,.16); border-radius: 20px; padding: 18px 20px 18px 62px; box-shadow: 0 8px 20px rgba(38,8,92,.08); }
  .contribute #password { padding-left: 20px; }
  .contribute textarea { min-height: 168px; padding-bottom: 34px; }
  .contribute .counter { display: block; margin: -32px 16px 12px 0; text-align: right; color: #766d9e; font-size: .85rem; }
  .contribute .upload-box { margin-top: 18px; padding: 22px; border: 2px dashed #c994ff; border-radius: 22px; background: rgba(255,255,255,.67); color: #24164a; text-align: center; }
  .contribute .upload-box strong, .contribute .upload-box small { display: block; }
  .contribute .upload-box strong { margin-top: 8px; font-size: 1.1rem; }
  .contribute .upload-icon { width: 60px; height: 60px; display: grid; place-items: center; margin: 0 auto; border-radius: 50%; background: #ead8ff; color: #6d21d9; }
  .contribute .upload-icon svg { width: 30px; height: 30px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
  .contribute .upload-box small { margin-top: 5px; color: #766d9e; }
  .contribute input[type=file] { position: absolute; width: 1px; height: 1px; opacity: 0; overflow: hidden; }
  .contribute .choose-image { display: inline-block; margin-top: 16px; padding: 12px 25px; border-radius: 999px; background: linear-gradient(90deg, #7425e4, #a800ff); color: #fff; font-weight: 800; cursor: pointer; box-shadow: 0 8px 18px rgba(85,24,202,.28); }
  .contribute .image-preview { display: none; grid-template-columns: 1fr 1.25fr; gap: 14px; align-items: center; margin-top: 18px; padding: 12px; border-radius: 18px; background: rgba(255,255,255,.85); color: #24164a; text-align: left; }
  .contribute .image-preview.show { display: grid; }
  .contribute .image-preview img { width: 100%; height: 112px; object-fit: cover; border-radius: 13px; }
  .contribute .image-preview strong, .contribute .image-preview small { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .contribute .image-preview small { margin-top: 5px; color: #766d9e; }
  .contribute .replace-image, .contribute .remove-image { border: 0; background: transparent; color: #7526d9; font: inherit; font-weight: 800; padding: 6px 0 0; cursor: pointer; }
  .contribute .remove-image { color: #b21d6c; margin-left: 12px; }
  .contribute button[type=submit] { margin-top: 24px; padding: 19px; border-radius: 20px; font-size: 1.08rem; box-shadow: 0 12px 22px rgba(88,16,160,.28); }
  .contribute button[type=submit]::first-letter { font-size: 1.15em; }
  @media (max-width: 560px) { .contribute-shell { padding-left: 12px; padding-right: 12px; } .contribute .card { padding: 18px; border-radius: 24px; margin-top: 28px; } .contribute h1 { font-size: 2.65rem; } .contribute .image-preview { grid-template-columns: 1fr; } .contribute .image-preview img { height: 150px; } }
`;
export function contributeUnavailablePage() {
    return htmlPage('Invite closed · WishDrop', `<div class="gift">💌</div>
     <span class="eyebrow">WISHDROP</span>
     <h1>This invite is closed</h1>
     <p class="muted">The surprise may have ended, or the creator turned off wishes.</p>`);
}
export function contributePage(surprise) {
    const script = `
    const form = document.getElementById('wish-form');
    const imageInput = document.getElementById('image');
    const imagePreview = document.getElementById('image-preview');
    const previewImage = document.getElementById('preview-image');
    const imageName = document.getElementById('image-name');
    const imageSize = document.getElementById('image-size');
    const message = document.getElementById('message');
    const counter = document.getElementById('counter');
    const formatSize = bytes => (bytes / 1024 / 1024).toFixed(bytes < 1024 * 1024 ? 1 : 2) + ' MB';
    message.addEventListener('input', () => { counter.textContent = message.value.length + '/500'; });
    previewImage.addEventListener('error', () => {
      imageInput.value = '';
      imagePreview.classList.remove('show');
      document.getElementById('status').textContent = 'That file could not be previewed. Choose a valid JPG, PNG, or WEBP image.';
    });
    imageInput.addEventListener('change', () => {
      const image = imageInput.files[0];
      if (!image) return;
      if (!image.type.startsWith('image/') || image.size === 0 || image.size > 5 * 1024 * 1024) {
        imageInput.value = '';
        imagePreview.classList.remove('show');
        document.getElementById('status').textContent = image.size === 0 ? 'That image is empty. Choose a valid JPG, PNG, or WEBP image up to 5 MB.' : 'Choose a JPG, PNG, or WEBP image up to 5 MB.';
        return;
      }
      previewImage.src = URL.createObjectURL(image);
      imageName.textContent = image.name;
      imageSize.textContent = formatSize(image.size);
      imagePreview.classList.add('show');
    });
    document.getElementById('replace-image').addEventListener('click', () => imageInput.click());
    document.getElementById('remove-image').addEventListener('click', () => {
      imageInput.value = '';
      previewImage.removeAttribute('src');
      imagePreview.classList.remove('show');
    });
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const status = document.getElementById('status');
      const button = e.target.querySelector('button');
      const imageInput = document.getElementById('image');
      status.textContent = '';
      button.disabled = true;
      const token = location.pathname.split('/').pop();
      const passwordEl = document.getElementById('password');
      let media = [];
      try {
        if (imageInput.files.length) {
          const image = imageInput.files[0];
          if (!image.type.startsWith('image/')) throw new Error('Please choose an image file.');
          if (image.size === 0) throw new Error('That image is empty. Choose a valid image file.');
          if (image.size > 5 * 1024 * 1024) throw new Error('Images must be 5 MB or smaller.');
          status.textContent = 'Uploading image…';
          const upload = new FormData();
          upload.append('file', image);
          const uploadResponse = await fetch('/v1/public/contribute/' + token + '/upload', { method: 'POST', body: upload });
          if (!uploadResponse.ok) {
            const body = await uploadResponse.json().catch(() => ({}));
            throw new Error(body.message || 'Could not upload the image.');
          }
          media = [(await uploadResponse.json()).media];
        }
        status.textContent = '';
        const response = await fetch('/v1/public/contribute/' + token, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            authorName: document.getElementById('name').value,
            message: document.getElementById('message').value,
            media,
            password: passwordEl ? passwordEl.value : undefined
          })
        });
        button.disabled = false;
        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          status.textContent = body.message || 'Could not send your wish. Try again.';
          return;
        }
      } catch (error) {
        button.disabled = false;
        status.textContent = error instanceof Error ? error.message : 'Could not send your wish. Try again.';
        return;
      }
      button.disabled = false;
      document.getElementById('wish-form').outerHTML = '<div class="card"><h1 style="font-size:1.6rem">Sent!</h1><p class="muted">Your wish will be part of the surprise.</p></div>';
    });
  `;
    const name = escape(surprise.recipientName);
    const pageUrl = escape(surprise.pageUrl);
    const passwordField = surprise.passwordRequired
        ? `<input id="password" type="password" maxlength="64" placeholder="Contribution password" required />`
        : '';
    return htmlPage(`Add your wish for ${name} · WishDrop`, `<section class="contribute">
     <div class="occasion">🎂 ${escape(surprise.occasion).toUpperCase()}</div>
     <h1>Add your wish for <span>${name} ♡</span></h1>
     <p class="muted">Your message will appear when ${name} opens the surprise.</p>
     <form id="wish-form" class="card">
       ${passwordField}
       <div class="field"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5"/><path d="M5 20c.7-3.2 3-5 7-5s6.3 1.8 7 5"/></svg><input id="name" maxlength="60" placeholder="Your name" required /></div>
       <div class="field textarea-field"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 8.8c0 5.5-8.8 10.2-8.8 10.2S3.2 14.3 3.2 8.8A4.8 4.8 0 0 1 12 6.1a4.8 4.8 0 0 1 8.8 2.7Z"/></svg><textarea id="message" maxlength="500" placeholder="Write something from the heart..." required></textarea></div>
       <span id="counter" class="counter">0/500</span>
       <div class="upload-box">
         <div class="upload-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.5"/><path d="m4 17 4.5-4 3.5 3 2.5-2 5.5 4"/></svg></div>
         <strong>Add a memory <span aria-hidden="true">(optional)</span></strong>
         <small>Upload one photo · JPG, PNG or WEBP · Max 5 MB</small>
         <label for="image" class="choose-image">☁ Choose image</label>
       </div>
       <input id="image" type="file" accept="image/*" />
       <div id="image-preview" class="image-preview">
         <img id="preview-image" alt="Selected image preview" />
         <div><strong id="image-name"></strong><small id="image-size"></small><button id="replace-image" type="button" class="replace-image">↻ Replace image</button><button id="remove-image" type="button" class="remove-image">Remove</button></div>
       </div>
       <button type="submit">➤ &nbsp; Send my wish</button>
       <p id="status" class="error" aria-live="polite"></p>
     </form></section>`, script, `<meta property="og:type" content="website" />
     <meta property="og:title" content="${pageUrl}" />
     <meta property="og:description" content="${pageUrl}" />
     <meta property="og:url" content="${pageUrl}" />
     <meta name="twitter:title" content="${pageUrl}" />
     <meta name="twitter:description" content="${pageUrl}" /><style>${contributeStyles}</style>`);
}
