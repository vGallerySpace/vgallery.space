/**
 * vGallerySpace — RESA All-in-One Floating Docent Lounge Widget
 */

(function () {
  'use strict';

  // Determine current page context
  const path = window.location.pathname.toLowerCase();
  let pageGreeting = "Welcome to vGallerySpace. I am RESA, your virtual docent. How can I guide your tour today?";

  if (path.includes('office')) {
    pageGreeting = "Welcome to the Office. I am RESA. Ask me about the gallery's historical archives, Wayback Machine records, and studio history.";
  } else if (path.includes('studio')) {
    pageGreeting = "Welcome to the Studio. I'm RESA. Ask me about Prototype No. 7, 3D modeling, and architectural sculpture concepts.";
  }

  // Build UI DOM
  const launcher = document.createElement('button');
  launcher.id = 'resa-launcher';
  launcher.setAttribute('aria-label', 'Open RESA Docent Lounge');
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
          <img src="assets/resa2.jpeg" alt="RESA">
        </div>
        <div class="resa-w-title-block">
          <div class="resa-w-title">RESA</div>
          <div class="resa-w-badge"><span class="resa-w-dot"></span> In Residence</div>
        </div>
      </div>
      <button class="resa-w-close-btn" id="resa-w-close" aria-label="Close Lounge">&times;</button>
    </div>

    <div class="resa-w-topics">
      <button class="resa-w-chip" onclick="window.sendResaTopic('Tell me about the Future, Current, and Past exhibition vision.')">⏳ Future / Current / Past</button>
      <button class="resa-w-chip" onclick="window.sendResaTopic('What is the curation philosophy behind vGallerySpace?')">🏛️ Curation Philosophy</button>
      <button class="resa-w-chip" onclick="window.sendResaTopic('Can you explain Prototype No. 7 and Arch > Scul?')">🗿 Arch > Scul Prototypes</button>
    </div>

    <div class="resa-w-messages" id="resa-w-msg-list">
      <div class="resa-w-msg bot">${pageGreeting}</div>
    </div>

    <div class="resa-w-footer">
      <input type="text" class="resa-w-input" id="resa-w-input" placeholder="Ask RESA about the gallery..." autocomplete="off">
      <button class="resa-w-send" id="resa-w-send">Send</button>
    </div>
  `;

  document.body.appendChild(launcher);
  document.body.appendChild(widget);

  let isOpen = false;
  const msgList = document.getElementById('resa-w-msg-list');
  const inputEl = document.getElementById('resa-w-input');
  const sendBtn = document.getElementById('resa-w-send');
  const closeBtn = document.getElementById('resa-w-close');

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

  window.openResaLounge = function() {
    if (!isOpen) toggle();
  };

  launcher.addEventListener('click', toggle);
  closeBtn.addEventListener('click', toggle);

  function handleSend(textOverride) {
    const text = textOverride || inputEl.value.trim();
    if (!text) return;

    if (!textOverride) inputEl.value = '';

    // Add user message
    const userMsg = document.createElement('div');
    userMsg.className = 'resa-w-msg user';
    userMsg.textContent = text;
    msgList.appendChild(userMsg);
    msgList.scrollTop = msgList.scrollHeight;

    // Smart Docent Reply
    setTimeout(() => {
      const lower = text.toLowerCase();
      let reply = "Welcome to vGallerySpace. I am RESA, your virtual docent. Our gallery spans multi-disciplinary explorations from our 1984–2014 Way Back Machine archives up to recent digital works and architectural sculptures.";

      if (lower.includes('future') || lower.includes('past') || lower.includes('current')) {
        reply = "vGallerySpace presents exhibitions across three temporal planes: Future (speculative digital architecture), Current (active exhibitions like codes.gallery), and Past (archival records spanning 1984–2014).";
      } else if (lower.includes('curation') || lower.includes('philosophy') || lower.includes('vgalleryspace')) {
        reply = "vGallerySpace is built on a philosophy of pure, tracker-free architectural presentation. We treat the digital space with the reverence of a physical institution.";
      } else if (lower.includes('prototype') || lower.includes('carbon') || lower.includes('arch') || lower.includes('scul')) {
        reply = "The Arch > Scul series examines the intersection of architecture and sculpture. Featured in our STUDIO exhibition, Prototype No. 7 explores transformable carbon fiber structures.";
      } else if (lower.includes('office') || lower.includes('archive') || lower.includes('facebook') || lower.includes('wayback')) {
        reply = "The OFFICE houses historical records, wayback machine archives, and reflections documenting the evolution of FRAMOUS's studio practice across nearly three decades.";
      } else if (lower.includes('codes') || lower.includes('store') || lower.includes('ebay') || lower.includes('artsy')) {
        reply = "You can view codes.gallery or explore available physical works and collectibles via our official eBay storefront and Artsy profiles linked in the top-right cart dropdown!";
      }

      const botMsg = document.createElement('div');
      botMsg.className = 'resa-w-msg bot';
      botMsg.textContent = reply;
      msgList.appendChild(botMsg);
      msgList.scrollTop = msgList.scrollHeight;
    }, 600);
  }

  window.sendResaTopic = function(topicText) {
    handleSend(topicText);
  };

  sendBtn.addEventListener('click', () => handleSend());
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSend();
  });
})();
