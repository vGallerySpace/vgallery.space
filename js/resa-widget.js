/**
 * vGallerySpace — RESA All-in-One Floating Docent Lounge Widget
 * Reads dynamically from assets/docent-knowledge.json with robust fallback keyword matching.
 */

(function () {
  'use strict';

  let docentKnowledge = null;

  // Fetch knowledge base asynchronously
  fetch('/assets/docent-knowledge.json')
    .then(res => res.json())
    .then(data => { docentKnowledge = data; })
    .catch(() => { /* Fallback handled gracefully in search */ });

  // Determine current page context greeting (Only shown ONCE at launch)
  const path = window.location.pathname.toLowerCase();
  let pageGreeting = 'Welcome to vGallerySpace. How can I guide your tour today?';

  if (path.includes('office')) {
    pageGreeting = "Welcome to the OFFICE. Ask me about historical archives, Wayback Machine records, or studio history.";
  } else if (path.includes('studio')) {
    pageGreeting = 'Welcome to the STUDIO. Ask me about Prototype No. 7, 3D models, or arch>scul prototypes.';
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
          <img src="/assets/resa2.jpeg" alt="RESA">
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
      <button class="resa-w-chip" onclick="window.sendResaTopic('Can you explain Prototype No. 7 and arch>scul prototypes?')">🗿 arch>scul prototypes</button>
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

  function escapeHTML(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function handleSend(textOverride) {
    const text = textOverride || inputEl.value.trim();
    if (!text) return;

    if (!textOverride) inputEl.value = '';

    // Add user message
    const userMsg = document.createElement('div');
    userMsg.className = 'resa-w-msg user';
    userMsg.innerHTML = escapeHTML(text);
    msgList.appendChild(userMsg);
    msgList.scrollTop = msgList.scrollHeight;

    // Direct, concise Docent Reply
    setTimeout(() => {
      const lower = text.toLowerCase();
      let reply = "";

      // 1. Try JSON Knowledge Base
      if (docentKnowledge && docentKnowledge.exhibitions) {
        for (const ex of docentKnowledge.exhibitions) {
          if (ex.keywords.some(k => lower.includes(k))) {
            reply = ex.summary;
            break;
          }
        }
        if (!reply && docentKnowledge.artist && docentKnowledge.artist.keywords.some(k => lower.includes(k))) {
          reply = docentKnowledge.artist.summary;
        }
      }

      // 2. Direct Robust Fallbacks (Guarantees no topic button ever fails)
      if (!reply) {
        if (lower.includes('future') || lower.includes('current') || lower.includes('past') || lower.includes('vision') || lower.includes('temporal')) {
          reply = "vGallerySpace presents exhibitions across three temporal planes: Future (speculative digital architecture), Current (active exhibitions like codes.gallery), and Past (archival records spanning 1984–2014).";
        } else if (lower.includes('curation') || lower.includes('philosophy') || lower.includes('vgalleryspace')) {
          reply = "vGallerySpace presents pure, tracker-free architectural exhibitions treated with the reverence of a physical institution.";
        } else if (lower.includes('codes') || lower.includes('codes.gallery')) {
          reply = "codes.gallery is our featured exhibition examining agentic AI collaboration, generative code as creative material, and solo structuring across nearly two years of intensive development.";
        } else if (lower.includes('favorite') || lower.includes('favourite') || lower.includes('best') || lower.includes('recommend') || lower.includes('highlight')) {
          reply = "My favorite highlight is Prototype No. 7 in the STUDIO—a transformable carbon fiber structure bridging physical architecture and sculpture. I also recommend codes.gallery in the GALLERY room.";
        } else if (lower.includes('protoype') || lower.includes('prototype') || lower.includes('prototypes')) {
          reply = "Featured in the STUDIO, Prototype No. 7 is an unfinished carbon fiber table exploring movable architecture under the arch>scul prototypes series.";
        } else if (lower.includes('sculpture') || lower.includes('sculptures')) {
          reply = "The arch>scul prototypes series examines the intersection of architecture and sculpture, led by Prototype No. 7 in the STUDIO.";
        } else if (lower.includes('office') || lower.includes('archive') || lower.includes('facebook') || lower.includes('wayback')) {
          reply = "The OFFICE houses Way Back Machine archives, Facebook records, and reflections documenting nearly three decades of studio evolution.";
        } else if (lower.includes('store') || lower.includes('buy') || lower.includes('ebay') || lower.includes('artsy') || lower.includes('acquire')) {
          reply = "You can acquire physical works and digital editions via Artsy, eBay, OpenSea, and Objkt in the top-right cart dropdown.";
        } else if (lower.includes('framous') || lower.includes('artist') || lower.includes('who')) {
          reply = "vGallerySpace was created by FRAMOUS, spanning architectural sculpture, brand direction, and digital/AI curation over three decades.";
        } else {
          reply = "Take your time exploring. Let me know if you'd like specific context on any exhibition or artwork!";
        }
      }

      const botMsg = document.createElement('div');
      botMsg.className = 'resa-w-msg bot';
      botMsg.innerHTML = reply;
      msgList.appendChild(botMsg);
      msgList.scrollTop = msgList.scrollHeight;
    }, 450);
  }

  window.sendResaTopic = function(topicText) {
    handleSend(topicText);
  };

  sendBtn.addEventListener('click', () => handleSend());
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSend();
  });
})();
