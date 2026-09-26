/**
 * vGallerySpace — RESA All-in-One Floating Docent Lounge Widget (ALL CAPS)
 */

(function () {
  'use strict';

  // Determine current page context
  const path = window.location.pathname.toLowerCase();
  let pageGreeting = "WELCOME TO VGALLERYSPACE. I AM RESA, YOUR VIRTUAL DOCENT. HOW CAN I GUIDE YOUR TOUR TODAY?";

  if (path.includes('office')) {
    pageGreeting = "WELCOME TO THE OFFICE. I AM RESA. ASK ME ABOUT THE GALLERY'S HISTORICAL ARCHIVES, WAYBACK MACHINE RECORDS, AND STUDIO HISTORY.";
  } else if (path.includes('studio')) {
    pageGreeting = "WELCOME TO THE STUDIO. I'M RESA. ASK ME ABOUT PROTOTYPE NO. 7, 3D MODELING, AND ARCHITECTURAL SCULPTURE CONCEPTS.";
  }

  // Build UI DOM
  const launcher = document.createElement('button');
  launcher.id = 'resa-launcher';
  launcher.setAttribute('aria-label', 'OPEN RESA DOCENT LOUNGE');
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
          <div class="resa-w-badge"><span class="resa-w-dot"></span> IN RESIDENCE</div>
        </div>
      </div>
      <button class="resa-w-close-btn" id="resa-w-close" aria-label="CLOSE LOUNGE">&times;</button>
    </div>

    <div class="resa-w-topics">
      <button class="resa-w-chip" onclick="window.sendResaTopic('TELL ME ABOUT THE FUTURE, CURRENT, AND PAST EXHIBITION VISION.')">⏳ FUTURE / CURRENT / PAST</button>
      <button class="resa-w-chip" onclick="window.sendResaTopic('WHAT IS THE CURATION PHILOSOPHY BEHIND VGALLERYSPACE?')">🏛️ CURATION PHILOSOPHY</button>
      <button class="resa-w-chip" onclick="window.sendResaTopic('CAN YOU EXPLAIN PROTOTYPE NO. 7 AND ARCH > SCUL?')">🗿 ARCH > SCUL PROTOTYPES</button>
    </div>

    <div class="resa-w-messages" id="resa-w-msg-list">
      <div class="resa-w-msg bot">${pageGreeting}</div>
    </div>

    <div class="resa-w-footer">
      <input type="text" class="resa-w-input" id="resa-w-input" placeholder="ASK RESA ABOUT THE GALLERY..." autocomplete="off">
      <button class="resa-w-send" id="resa-w-send">SEND</button>
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
    userMsg.textContent = text.toUpperCase();
    msgList.appendChild(userMsg);
    msgList.scrollTop = msgList.scrollHeight;

    // Smart Docent Reply (ALL CAPS)
    setTimeout(() => {
      const lower = text.toLowerCase();
      let reply = "WELCOME TO VGALLERYSPACE. I AM RESA, YOUR VIRTUAL DOCENT. OUR GALLERY SPANS MULTI-DISCIPLINARY EXPLORATIONS FROM OUR 1984–2014 WAY BACK MACHINE ARCHIVES UP TO RECENT DIGITAL WORKS AND ARCHITECTURAL SCULPTURES.";

      if (lower.includes('future') || lower.includes('past') || lower.includes('current')) {
        reply = "VGALLERYSPACE PRESENTS EXHIBITIONS ACROSS THREE TEMPORAL PLANES: FUTURE (SPECULATIVE DIGITAL ARCHITECTURE), CURRENT (ACTIVE EXHIBITIONS LIKE CODES.GALLERY), AND PAST (ARCHIVAL RECORDS SPANNING 1984–2014).";
      } else if (lower.includes('curation') || lower.includes('philosophy') || lower.includes('vgalleryspace')) {
        reply = "VGALLERYSPACE IS BUILT ON A PHILOSOPHY OF PURE, TRACKER-FREE ARCHITECTURAL PRESENTATION. WE TREAT THE DIGITAL SPACE WITH THE REVERENCE OF A PHYSICAL INSTITUTION.";
      } else if (lower.includes('prototype') || lower.includes('carbon') || lower.includes('arch') || lower.includes('scul')) {
        reply = "THE ARCH > SCUL SERIES EXAMINES THE INTERSECTION OF ARCHITECTURE AND SCULPTURE. FEATURED IN OUR STUDIO EXHIBITION, PROTOTYPE NO. 7 EXPLORES TRANSFORMABLE CARBON FIBER STRUCTURES.";
      } else if (lower.includes('office') || lower.includes('archive') || lower.includes('facebook') || lower.includes('wayback')) {
        reply = "THE OFFICE HOUSES HISTORICAL RECORDS, WAYBACK MACHINE ARCHIVES, AND REFLECTIONS DOCUMENTING THE EVOLUTION OF FRAMOUS'S STUDIO PRACTICE ACROSS NEARLY THREE DECADES.";
      } else if (lower.includes('codes') || lower.includes('store') || lower.includes('ebay') || lower.includes('artsy')) {
        reply = "YOU CAN VIEW CODES.GALLERY OR EXPLORE AVAILABLE PHYSICAL WORKS AND COLLECTIBLES VIA OUR OFFICIAL EBAY STOREFRONT AND ARTSY PROFILES LINKED IN THE TOP-RIGHT CART DROPDOWN!";
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
