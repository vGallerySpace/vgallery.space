/**
 * vGallerySpace — RESA Floating Docent Pop-Up Widget
 */

(function () {
  'use strict';

  // Determine current page context
  const path = window.location.pathname.toLowerCase();
  let pageContext = "General vGallerySpace Exhibition Guide";
  let pageGreeting = "Welcome to vGallerySpace. I'm RESA, your virtual docent. Ask me anything about the gallery!";

  if (path.includes('office')) {
    pageContext = "vGallerySpace Office & Archival Records (including historical Facebook archives)";
    pageGreeting = "Welcome to the Office. I am RESA. Ask me about the gallery's history, archives, and records.";
  } else if (path.includes('studio')) {
    pageContext = "vGallerySpace Studio & 3D Modeling Production Lab";
    pageGreeting = "Welcome to the Studio. I'm RESA. Ask me about production methods, 3D sculptures, and design concepts.";
  } else if (path.includes('exhibition') || path.includes('archscul') || path.includes('prototype')) {
    pageContext = "Specific vGallerySpace Exhibition Guide";
    pageGreeting = "Hello! I'm RESA. Ask me about this exhibition and its underlying concepts.";
  }

  // Build UI DOM
  const launcher = document.createElement('button');
  launcher.id = 'resa-launcher';
  launcher.setAttribute('aria-label', 'Open RESA Docent Chat');
  launcher.innerHTML = `
    <svg class="icon-chat" viewBox="0 0 24 24">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
    <svg class="icon-close" viewBox="0 0 24 24">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  `;

  const widget = document.createElement('div');
  widget.id = 'resa-widget';
  widget.innerHTML = `
    <div class="resa-w-header">
      <div class="resa-w-info">
        <div class="resa-w-avatar">
          <img src="/assets/resa2.jpeg" alt="RESA">
        </div>
        <div>
          <div class="resa-w-title">RESA</div>
          <div class="resa-w-status">Virtual Docent</div>
        </div>
      </div>
      <a href="/docent-lounge" class="resa-w-lounge-link" title="Full Lounge">Lounge ↗</a>
    </div>
    <div class="resa-w-messages" id="resa-w-msg-list">
      <div class="resa-w-msg bot">${pageGreeting}</div>
    </div>
    <div class="resa-w-footer">
      <input type="text" class="resa-w-input" id="resa-w-input" placeholder="Ask RESA..." autocomplete="off">
      <button class="resa-w-send" id="resa-w-send">Send</button>
    </div>
  `;

  document.body.appendChild(launcher);
  document.body.appendChild(widget);

  let isOpen = false;
  const msgList = document.getElementById('resa-w-msg-list');
  const inputEl = document.getElementById('resa-w-input');
  const sendBtn = document.getElementById('resa-w-send');

  function toggle() {
    isOpen = !isOpen;
    if (isOpen) {
      launcher.classList.add('is-open');
      widget.classList.add('is-visible');
      setTimeout(() => inputEl.focus(), 150);
    } else {
      launcher.classList.remove('is-open');
      widget.classList.remove('is-visible');
    }
  }

  launcher.addEventListener('click', toggle);

  function handleSend() {
    const text = inputEl.value.trim();
    if (!text) return;

    inputEl.value = '';

    // Add user message
    const userMsg = document.createElement('div');
    userMsg.className = 'resa-w-msg user';
    userMsg.textContent = text;
    msgList.appendChild(userMsg);
    msgList.scrollTop = msgList.scrollHeight;

    // Simulated docent reply placeholder
    setTimeout(() => {
      const botMsg = document.createElement('div');
      botMsg.className = 'resa-w-msg bot';
      botMsg.textContent = "Thank you for asking! For deep exhibition context, step into the full Docent Lounge above.";
      msgList.appendChild(botMsg);
      msgList.scrollTop = msgList.scrollHeight;
    }, 600);
  }

  sendBtn.addEventListener('click', handleSend);
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSend();
  });
})();
