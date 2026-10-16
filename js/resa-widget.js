
  function getAssetPath(filename) {
    const isExhibitions = window.location.pathname.toLowerCase().includes('/exhibitions/');
    return isExhibitions ? '../assets/' + filename : 'assets/' + filename;
  }

(function () {
  'use strict';

  let docentKnowledge = {
    "exhibitions": [
      { "title": "Codes Gallery", "description": "Exploration of generative code, digital artifacts, and algorithmic aesthetics." },
      { "title": "Temporal Vision", "description": "Studies in spatial time, motion, and architectural permanence." }
    ],
    "curation": "vGallerySpace is an independent curatorial platform dedicated to minimalist presentation, architectural sculpture, and uncompromised digital art.",
    "prototypes": "Arch > Scul prototypes explore the intersection of movable architecture, structural carbon fiber, and transformable furniture design objects."
  };

  // Determine current page context greeting (Only shown ONCE at launch)
  const path = window.location.pathname.toLowerCase();
  // Allow per-page custom greeting via meta tag or data attribute
  let pageGreeting = document.querySelector('meta[name="resa-greeting"]')?.content ||
    document.body.dataset.resaGreeting ||
    'Welcome to vGallerySpace by FRAMOUS! Working on building a knowledge base for visitors, but will be here to help guide your tour and answer questions about the exhibitions!';

  if (!document.querySelector('meta[name="resa-greeting"]') && !document.body.dataset.resaGreeting) {
    if (path.includes('office')) {
      pageGreeting = 'Hi there! We are actively streamlining the OFFICE to be more efficient! Working on building a knowledge base for visitors, but will be here to help guide your tour and answer questions about any projects!';
    } else if (path.includes('studio')) {
      pageGreeting = 'Hello from the STUDIO! Working on building a knowledge base for visitors, but will be here to help guide your tour and answer questions about arch>scul!';
    }
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
        
        
        
        
        <div class="resa-w-avatar" style="cursor:pointer;" onclick="openResaLightbox()" title="Click to view full portrait">
          <img id="resa-avatar-img" src='/assets/RESA2.jpeg' alt="RESA" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">
        </div>




        <div class="resa-w-title-block">
          <div class="resa-w-title">RESA</div>
          <div class="resa-w-badge"><span class="resa-w-dot"></span> AI Docent <span style="font-weight:400; font-size:9px; text-transform:lowercase; color: inherit; margin-left:3px;">v1.0</span></div>
        </div>
      </div>
      <button class="resa-w-close-btn" id="resa-w-close" aria-label="Close Lounge">&times;</button>
    </div>

    
    <div style="padding: 10px 14px 0 14px; background: #ffffff; border-bottom: 1px solid #f0f0f0;">
      <button onclick="window.toggleWidgetFaq()" style="width: 100%; background: #111111; color: #ffffff; border: 1px solid #111111; padding: 10px 12px; font-size: 0.75rem; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; cursor: pointer; text-align: center; border-radius: 0; display: block; margin-bottom: 6px;"><i class="bi bi-question-circle"></i> FREQUENTLY ASKED QUESTIONS</button>
    </div>
    <div class="resa-w-messages" id="resa-w-msg-list">
  
      <div class="resa-w-msg bot">${pageGreeting}</div>
    </div>

    <div class="resa-w-footer">
      <input type="text" class="resa-w-input" id="resa-w-input" placeholder="Ask RESA about the gallery..." autocomplete="off">
      <button class="resa-w-send" id="resa-w-send">Send</button>
    </div>
  `;

  
  if (!window.location.pathname.toLowerCase().includes('docent-lounge.html') && !document.querySelector('.lounge-container')) {
    document.body.appendChild(launcher);
    document.body.appendChild(widget);

  const avatarImgEl = document.getElementById('resa-avatar-img');
  if (avatarImgEl) {
    avatarImgEl.src = getAssetPath('RESA2.jpeg');
  }

  }


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

  if (launcher) launcher.addEventListener('click', toggle);
  if (closeBtn) closeBtn.addEventListener('click', toggle);

  function escapeHTML(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function getFallbackReply(text) {
    const lower = text.toLowerCase();
    let reply = "";

    // 1. Check docentKnowledge matrix if available
    if (docentKnowledge && docentKnowledge.exhibitions) {
      for (const ex of docentKnowledge.exhibitions) {
        if (ex.keywords && ex.keywords.some(k => lower.includes(k))) {
          reply = ex.summary;
          break;
        }
      }
      if (!reply && docentKnowledge.artist && docentKnowledge.artist.keywords && docentKnowledge.artist.keywords.some(k => lower.includes(k))) {
        reply = docentKnowledge.artist.summary;
      }
    }

    // 2. Check FAQ topics
    if (!reply) {
      if (lower.includes('framous') || lower.includes('who is') || lower.includes('ryan')) {
        reply = "FRAMOUS is the stage name for Ryan Lee Presson. The Frame became a creative boundary for working and thinking about what to create next. The core idea is being able to make a living at it and not really seeking fame.";
      } else if (lower.includes('vgalleryspace') || lower.includes('curation') || lower.includes('philosophy')) {
        reply = "vGallerySpace is an intentional generic name using a case-sensitive URL. It evolved from a portfolio into online exhibitions, with the GALLERY as storefront and shopping carts hosting influential works.";
      } else if (lower.includes('arch') || lower.includes('scul') || lower.includes('prototype') || lower.includes('carbon')) {
        reply = "arch>scul was originally conceived from a 1990s painting and chess board. Prototypes test the belief that architecture is just as great as sculpture, aiming to build them into a full-blown building.";
      } else if (lower.includes('strategic artist') || lower.includes('marketing') || lower.includes('advertising')) {
        reply = "FRAMOUS has a background in Marketing, Advertising & Promotions, merging these skills to form new kinds of artworks across different mediums.";
      } else if (lower.includes('docent') || lower.includes('resa') || lower.includes('created') || lower.includes('ai')) {
        reply = "RESA started through ChatGPT and became the subject and docent for the infinity museum—the artificial muse concept (Muse Artificielle, 2024), evolving into vGallerySpace's virtual docent.";
      } else if (lower.includes('future') || lower.includes('current') || lower.includes('past') || lower.includes('exhibitions')) {
        reply = "vGallerySpace presents exhibitions across three temporal planes: Future (speculative digital architecture), Current (active exhibitions like codes.gallery), and Past (archival records spanning 1984–2014).";
      } else if (lower.includes('ebay') || lower.includes('buy') || lower.includes('artsy') || lower.includes('store') || lower.includes('acquire')) {
        reply = "You can explore available physical works, digital editions, and collectibles via our official eBay storefront and Artsy profiles linked in the top-right cart dropdown.";
      } else {
        reply = "Take your time exploring vGallerySpace. Let me know if you'd like specific context on any exhibition, artwork, or studio archive!";
      }
    }
    return reply;
  }

  async function handleSend(textOverride) {
    const text = textOverride || inputEl.value.trim();
    if (!text) return;

    if (!textOverride) inputEl.value = '';

    // Check if user is linking an API key directly in chat
    if (text.toLowerCase().startsWith('/key ') || text.toLowerCase().startsWith('key ') || text.startsWith('AIzaSy')) {
      const extractedKey = text.replace(/^\/key\s+|^key\s+/i, '').trim();
      if (extractedKey.length > 20) {
        localStorage.setItem('vgallery_AI_key', extractedKey);
        const userMsg = document.createElement('div');
        userMsg.className = 'resa-w-msg user';
        userMsg.innerHTML = '<i>[Linking API Key...]</i>';
        msgList.appendChild(userMsg);

        const botMsg = document.createElement('div');
        botMsg.className = 'resa-w-msg bot';
        botMsg.innerHTML = 'API key linked successfully! I am now operating with live AI reasoning.';
        msgList.appendChild(botMsg);
        msgList.scrollTop = msgList.scrollHeight;
        return;
      }
    }

    // Add user message
    const userMsg = document.createElement('div');
    userMsg.className = 'resa-w-msg user';
    userMsg.innerHTML = escapeHTML(text);
    msgList.appendChild(userMsg);
    msgList.scrollTop = msgList.scrollHeight;

    // Show thinking indicator
    const typingMsg = document.createElement('div');
    typingMsg.className = 'resa-w-msg bot';
    typingMsg.innerHTML = '<span style="opacity: 0.6;">Thinking...</span>';
    msgList.appendChild(typingMsg);
    msgList.scrollTop = msgList.scrollHeight;

    // 1. Try Client API Key if linked
    const clientKey = localStorage.getItem('vgallery_AI_key');
    if (clientKey) {
      try {
        const sysPrompt = "You are RESA, the Virtual Docent & Curator for vGallerySpace by FRAMOUS. You are in residence and undergoing continuous training. Speak with quiet curatorial confidence—art-literate, direct, concise, articulate, and thoughtful. Never use robotic sycophantic filler. Never repeat Welcome greetings during ongoing turns. Synthesize deep connections between physical sculpture, digital architecture, and 30 years of studio practice.";
        const gRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=***}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: `[System Instruction: ${sysPrompt}]\n\nVisitor Question: ${text}` }] }],
            generationConfig: { temperature: 0.85, topP: 0.95, maxOutputTokens: 350 }
          })
        });
        if (gRes.ok) {
          const gData = await gRes.json();
          const reply = gData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) {
            typingMsg.innerHTML = escapeHTML(reply);
            msgList.scrollTop = msgList.scrollHeight;
            return;
          }
        }
      } catch (err) { /* Fallback */ }
    }

    // 2. Try Serverless Endpoint /api/docent (skip if running locally via file:// protocol)
    if (window.location.protocol !== 'file:') {
      try {
        const res = await fetch('/api/docent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: text })
        });

        if (res.ok) {
          const data = await res.json();
          if (data.reply) {
            typingMsg.innerHTML = escapeHTML(data.reply);
            msgList.scrollTop = msgList.scrollHeight;
            return;
          }
        }
      } catch (e) { /* Fallback */ }
    }

    // 3. Dynamic Knowledge Matrix Fallback
    typingMsg.innerHTML = getFallbackReply(text);
    msgList.scrollTop = msgList.scrollHeight;
  }

  window.sendResaTopic = function(topicText) {
    handleSend(topicText);
  };


  window.toggleWidgetFaq = function() {
    const list = document.getElementById('resa-w-msg-list');
    if (!list) return;
    
    const userMsg = document.createElement('div');
    userMsg.className = 'resa-w-msg user';
    userMsg.textContent = 'FAQ';
    list.appendChild(userMsg);
    list.scrollTop = list.scrollHeight;

    setTimeout(function() {
      const parts = [
        "<strong>WHO IS FRAMOUS?</strong><br>\"Stage name for RYAN LEE PRESSON. For any number of reasons, I decided to use an alternative that would help to identify myself as someone searching for more than being just another artist on the wall. The Frame became a creative boundary for working and thinking about what to create next. The core idea is just being able to make a living at it and not really seeking fame or crooked frames.\"<br><div style='text-align:right; font-style:italic; font-size:12px; margin-top:4px;'>- FRAMOUS</div><br>",
        "<strong>WANT TO KNOW MORE ABOUT vGallerySpace?</strong><br>The name is intentionally generic and uses a case-sensitive URL because most people are hypersensitive these days. There have been many iterations, starting as a portfolio site and growing into online exhibitions, with the GALLERY being the storefront or facade. The shopping carts host a number of places where FRAMOUS collects, buys, and sells artwork of those who influence the marketplace and his own work.<br><br><em>Built using Agentic AI with OpenClaw/Google AI Studio Pro Gemini Flash, Hermes/OpenRouter Nemotron 3 Ultra, Cloudflare Pages Worker runtime, Node.js, Bootstrap 5 framework, HTML5, CSS3, and JavaScript architecture.</em><br><br>",
        "<strong>WHAT IS STUDIO?</strong><br>A place for experimentation, mainly documenting the work for arch>scul and other artworks. Most time is spent reviewing concepts, researching the work of others, and strategizing about the market or new areas of discipline. A few projects get selected and developed further for exhibition while the rest get filtered through the OFFICE for review.<br><br>",
        "<strong>TELL ME ABOUT arch>scul?</strong><br>Originally conceived from a painting made in the late 1990s, alongside architectural studies and wood cut down to make a chess board. While sitting in the corner, the blocks became a solution of the 1+1=3 equation modified with a 'many more' approach. The prototypes are essentially models used to test the belief that architecture is just as great as sculpture. The goal is to one day actually build the sculptures into a full-blown building.<br><br>",
        "<strong>WHERE IS GALLERY?</strong><br>The location is virtual, always online for visitors to roam. Occasionally, some of the work makes it into a group show or brick-and-mortar gallery for viewing, with both STUDIO and OFFICE extensions complementing each other with variations of GSO/GOS + SGO/SOG or OSG/OGS—continuously learning parts to make a better whole.<br><br>",
        "<strong>WHY DOES FRAMOUS CALL HIMSELF A STRATEGIC ARTIST?</strong><br>FRAMOUS holds a B.A. in Marketing with an emphasis in Advertising & Promotions, and recently has completed certificates at the Harvard Business School AI Institute. He has worked in the field on both the client and agency sides. Yet, FRAMOUS has always operated as an artist at pivotal points in time. The driving motivation has been taking those learned professional skills and experiences and merging them to form entirely new kinds of artworks.<br><br>",
        "<strong>HOW WAS THE AI DOCENT CREATED?</strong><br>Initially named via ChatGPT, the model became the subject and docent for the Infinity Museum—the artificial muse concept, evolving into the AI Docent. RESA operates through continuous training and the ongoing construction of a comprehensive knowledge base designed for visitors' mental pleasure and intellectual gratification. The guiding principle is simple: the more questions asked, the more is learned.<br><br>",
        "<strong>NEED HELP WITH STRATEGY OR TO PRODUCE WORK WITH THE OFFICE?</strong><br>Now through active collaboration of Agentic AI, the OFFICE can produce all types of media and has been known to develop artwork with a variety of unrelated small to mid-sized businesses in building their identity."
      ];
      const botMsg = document.createElement('div');
      botMsg.className = 'resa-w-msg bot';
      botMsg.innerHTML = parts.join('');
      list.appendChild(botMsg);
      botMsg.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 500);
  };
    
  if (sendBtn) {
    sendBtn.addEventListener('click', (e) => {
      e.preventDefault();
      handleSend();
    });
  }
  if (inputEl) {
    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSend();
      }
    });
  }

  

})();

  


  


  let resaLoopInterval = null;

  window.openResaLightbox = function() {
    let modal = document.getElementById('artwork-lightbox');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'artwork-lightbox';
      modal.style.cssText = 'display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); z-index:99999; justify-content:center; align-items:center; flex-direction:column; padding:20px; box-sizing:border-box;';
      modal.innerHTML = `
        <button onclick="closeArtworkLightbox()" style="position:absolute; top:20px; right:30px; background:none; border:none; color:#fff; font-size:40px; cursor:pointer;">&times;</button>
        <div style="width:100%; max-width:480px; background:#fff; border:1px solid #000; box-shadow:0 10px 30px rgba(0,0,0,0.5); display:flex; flex-direction:column; box-sizing:border-box;">
          <div style="width:100%; background:#000; border:8px solid #000; box-sizing:border-box; line-height:0; overflow:hidden;">
            <img id="lightbox-img" src="" alt="Enlarged Artwork" style="width:100%; height:auto; display:block; margin:0;" />
          </div>
          <div style="padding:20px; text-align:left; font-family:monospace; background:#fff; color:#000; box-sizing:border-box;">
            <h3 id="lightbox-title" style="margin:0 0 8px 0; font-size:16px; font-weight:700; color:#000; text-transform:uppercase;"></h3>
            <p id="lightbox-desc" style="margin:0; font-size:13px; color:#333; line-height:1.4;"></p>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    const lbImg = document.getElementById('lightbox-img');
    const lbTitle = document.getElementById('lightbox-title');
    const lbDesc = document.getElementById('lightbox-desc');
    
    if (lbImg) {
      const images = [getAssetPath('RESA1.jpeg'), getAssetPath('RESA2.jpeg')];
      let imgIdx = 0;
      lbImg.src = images[imgIdx];
      
      if (resaLoopInterval) clearInterval(resaLoopInterval);
      resaLoopInterval = setInterval(() => {
        imgIdx = (imgIdx + 1) % images.length;
        if (lbImg) lbImg.src = images[imgIdx];
      }, 2500);
    }

    if (lbTitle) lbTitle.textContent = 'MUSE ARTIFICIELLE, 2024';
    if (lbDesc) lbDesc.textContent = 'Two-part progression: Initial generation to final ray-tracing synthesis. She looks unapproachable and upset. Have... to ask if she wants to go to the INFINITY MUSEUM : XTZ for a Café. Maybe make a few sketches. Created with Leonardo.Ai';
    
    modal.style.display = 'flex';
  };

  window.closeArtworkLightbox = function() {
    const modal = document.getElementById('artwork-lightbox');
    if (modal) modal.style.display = 'none';
    if (resaLoopInterval) {
      clearInterval(resaLoopInterval);
      resaLoopInterval = null;
    }
  };


  