/* ═══════════════════════════════════════════════════
   Nana V2 — App Engine
   Twilight-elegant birthday scavenger hunt
   ═══════════════════════════════════════════════════ */
(function () {
  "use strict";

  const app = document.getElementById("app");
  const progressContainer = document.getElementById("progress-bar-container");
  const progressBar = document.getElementById("progress-bar");
  let currentStage = -1;
  const totalStages = () => CONTENT.stages.length;

  // ─── PARTICLES (fireflies in a twilight forest) ────
  function initParticles() {
    const c = document.getElementById("particles");
    const ctx = c.getContext("2d");
    let w, h, pts = [];
    function resize() { w = c.width = innerWidth; h = c.height = innerHeight; }
    resize(); window.addEventListener("resize", resize);
    for (let i = 0; i < 45; i++) {
      pts.push({
        x: Math.random() * w, y: Math.random() * h,
        r: Math.random() * 1.5 + 0.3,
        dx: (Math.random() - 0.5) * 0.2, dy: (Math.random() - 0.5) * 0.15,
        baseAlpha: Math.random() * 0.3 + 0.05,
        phase: Math.random() * Math.PI * 2
      });
    }
    let t = 0;
    function draw() {
      ctx.clearRect(0, 0, w, h);
      t += 0.008;
      for (const p of pts) {
        const flicker = Math.sin(t * 2 + p.phase) * 0.15 + 0.85;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(143, 179, 201, ${p.baseAlpha * flicker})`;
        ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > w) p.dx *= -1;
        if (p.y < 0 || p.y > h) p.dy *= -1;
      }
      requestAnimationFrame(draw);
    }
    draw();
  }

  // ─── MUSIC (ambient forest pad) ────────────────────
  let audioCtx, musicOn = false;
  function initMusic() {
    const btn = document.getElementById("music-toggle");
    const off = document.getElementById("music-icon-off");
    const on = document.getElementById("music-icon-on");
    btn.addEventListener("click", () => {
      if (!audioCtx) { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); startAmbient(); }
      musicOn = !musicOn;
      if (musicOn) { audioCtx.resume(); off.style.display = "none"; on.style.display = "block"; }
      else { audioCtx.suspend(); off.style.display = "block"; on.style.display = "none"; }
    });
  }
  function startAmbient() {
    const notes = [174.61, 220, 261.63, 329.63]; // F3, A3, C4, E4
    function pad() {
      const n = notes[Math.floor(Math.random() * notes.length)];
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      const f = audioCtx.createBiquadFilter();
      o.type = "sine"; o.frequency.value = n;
      f.type = "lowpass"; f.frequency.value = 600;
      g.gain.setValueAtTime(0, audioCtx.currentTime);
      g.gain.linearRampToValueAtTime(0.03, audioCtx.currentTime + 2);
      g.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 7);
      o.connect(f); f.connect(g); g.connect(audioCtx.destination);
      o.start(); o.stop(audioCtx.currentTime + 7);
      setTimeout(pad, 2000 + Math.random() * 3000);
    }
    pad();
  }

  // ─── DOM HELPERS ───────────────────────────────────
  function el(tag, attrs = {}, children = []) {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "className") e.className = v;
      else if (k === "innerHTML") e.innerHTML = v;
      else if (k.startsWith("on") && typeof v === "function") e.addEventListener(k.slice(2).toLowerCase(), v);
      else e.setAttribute(k, v);
    }
    for (const c of children) {
      if (typeof c === "string") e.appendChild(document.createTextNode(c));
      else if (c) e.appendChild(c);
    }
    return e;
  }

  function transitionTo(fn) {
    const old = app.querySelector(".screen");
    if (old) {
      old.classList.add("screen-exit");
      let done = false;
      const go = () => { if (done) return; done = true; app.innerHTML = ""; fn(); window.scrollTo(0, 0); };
      old.addEventListener("animationend", go, { once: true });
      setTimeout(go, 500);
    } else { app.innerHTML = ""; fn(); window.scrollTo(0, 0); }
  }

  function updateProgress() {
    if (currentStage < 0) { progressContainer.style.display = "none"; return; }
    progressContainer.style.display = "block";
    progressBar.style.width = ((currentStage + 1) / totalStages() * 100) + "%";
  }

  function contBtn(text, fn) { return el("button", { className: "btn-continue", onClick: fn }, [text + " →"]); }
  function img(name) { return `./assets/${name}.jpg`; }

  // ─── CONFETTI ─────────────────────────────────────
  function confetti() {
    const colors = ["#8fb3c9", "#c9b896", "#b08e9a", "#7ec89e", "#e2e0e4"];
    for (let i = 0; i < 50; i++) {
      const p = document.createElement("div"); p.className = "confetti-piece";
      p.style.left = Math.random() * 100 + "vw"; p.style.top = "-10px";
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      p.style.animationDuration = (2 + Math.random() * 2) + "s";
      p.style.animationDelay = Math.random() * 1.2 + "s";
      p.style.width = (5 + Math.random() * 7) + "px";
      p.style.height = (5 + Math.random() * 7) + "px";
      p.style.borderRadius = Math.random() > 0.5 ? "50%" : "1px";
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 5000);
    }
  }

  // ─── MINI SPARKLE (creative touch: stage-complete burst) ─
  function sparkle(targetEl) {
    if (!targetEl) return;
    const rect = targetEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    for (let i = 0; i < 14; i++) {
      const s = document.createElement("div");
      s.className = "sparkle-dot";
      const angle = (Math.PI * 2 / 14) * i;
      const dist = 30 + Math.random() * 50;
      s.style.left = cx + "px";
      s.style.top = cy + "px";
      s.style.setProperty("--dx", Math.cos(angle) * dist + "px");
      s.style.setProperty("--dy", Math.sin(angle) * dist + "px");
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 700);
    }
  }

  // ─── CROWN EASTER EGG ────────────────────────────
  // If Nana taps any ♛ crown symbol, show a tooltip
  function initCrownEasterEgg() {
    document.addEventListener("click", (e) => {
      if (e.target.textContent && e.target.textContent.trim().includes("♛")) {
        const tip = document.createElement("div");
        tip.className = "crown-tooltip";
        tip.textContent = "Title earned. Non-negotiable. — Your Viking";
        tip.style.left = e.clientX + "px";
        tip.style.top = (e.clientY - 40) + "px";
        document.body.appendChild(tip);
        setTimeout(() => tip.remove(), 2500);
      }
    });
  }

  function nextStage() { if (currentStage < totalStages() - 1) goToStage(currentStage + 1); }
  function goToStage(i) {
    currentStage = i; updateProgress();
    transitionTo(() => {
      const renderers = {
        cipher: renderCipher, scratch: renderScratch, "vocab-game": renderVocab,
        trivia: renderTrivia, jigsaw: renderJigsaw, "boarding-pass": renderBoarding, finale: renderFinale
      };
      (renderers[CONTENT.stages[i].type] || renderCipher)(CONTENT.stages[i]);
    });
  }

  // ─── BIRTHDAY CARD (envelope) ──────────────────────
  function renderCard() {
    currentStage = -1; updateProgress();
    const C = CONTENT.card;
    const screen = el("div", { className: "screen" });

    // Envelope
    const container = el("div", { className: "envelope-container" });
    const envelope = el("div", { className: "envelope" });
    const flap = el("div", { className: "envelope-flap" });
    const body = el("div", { className: "envelope-body" }, [el("span", {}, [C.envelopeLabel])]);
    const cardInside = el("div", { className: "card-inside" }, [
      el("div", { className: "card-front-text" }, [C.frontMessage]),
      el("div", { className: "card-front-sub" }, [C.frontSubtitle])
    ]);
    envelope.append(body, flap, cardInside);
    container.appendChild(envelope);

    let opened = false;
    container.addEventListener("click", () => {
      if (opened) return;
      opened = true;
      envelope.classList.add("opened");
      sparkle(container);
      setTimeout(() => {
        container.style.display = "none";
        const msgEl = el("p", { className: "card-message" }, [C.insideMessage]);
        msgEl.style.opacity = "0";
        msgEl.style.animation = "screen-in .6s var(--ease) forwards";
        screen.insertBefore(msgEl, startBtn);
        startBtn.style.opacity = "0";
        startBtn.style.animation = "screen-in .6s var(--ease) .3s forwards";
        startBtn.style.display = "inline-flex";
      }, 1200);
    });

    const tapHint = el("div", { style: "margin-bottom:var(--sp-4);font-size:var(--text-xs);color:var(--text-faint);letter-spacing:.15em;text-transform:uppercase;opacity:0;animation:screen-in .6s var(--ease) .2s forwards" }, ["Tap to open"]);
    screen.appendChild(tapHint);
    screen.appendChild(container);

    const startBtn = el("button", { className: "btn-primary", style: "display:none", onClick: () => goToStage(0) }, [C.buttonText]);
    screen.appendChild(startBtn);
    app.appendChild(screen);
  }

  // ─── 1. CIPHER ─────────────────────────────────────
  function renderCipher(s) {
    const screen = el("div", { className: "screen" });
    screen.append(
      el("div", { className: "stage-label" }, ["Stage " + s.stageLabel]),
      el("div", { className: "stage-icon" }, [s.icon]),
      el("h2", { className: "stage-title" }, [s.title]),
      el("p", { className: "stage-intro" }, [s.intro])
    );

    const card = el("div", { className: "card-box" });
    const display = el("div", { className: "cipher-display" });
    const valLabel = el("div", { className: "cipher-value" }, ["Shift: 0"]);

    function encode(text, shift) {
      return text.split("").map(ch => {
        if (ch >= "A" && ch <= "Z") return String.fromCharCode(((ch.charCodeAt(0) - 65 + shift) % 26 + 26) % 26 + 65);
        if (ch >= "a" && ch <= "z") return String.fromCharCode(((ch.charCodeAt(0) - 97 + shift) % 26 + 26) % 26 + 97);
        return ch;
      }).join("");
    }

    const encrypted = encode(s.plainText, s.cipherShift);
    display.textContent = encrypted;

    const wrap = el("div", { className: "cipher-slider-wrap" });
    wrap.appendChild(el("label", {}, ["Drag to decode"]));
    const slider = el("input", { className: "cipher-slider", type: "range", min: "0", max: "25", value: "0" });

    let solved = false;
    slider.addEventListener("input", () => {
      const shift = parseInt(slider.value);
      valLabel.textContent = "Shift: " + shift;
      const decoded = encode(encrypted, -shift);
      display.textContent = decoded;
      if (shift === s.cipherShift && !solved) {
        solved = true;
        display.classList.add("solved");
        sparkle(display);
        setTimeout(() => {
          const resp = el("div", { className: "response-box" }, [
            el("p", { className: "response-text" }, [s.successMessage]),
            contBtn("Continue", nextStage)
          ]);
          screen.appendChild(resp);
        }, 400);
      }
    });

    wrap.appendChild(slider);
    card.append(display, wrap, valLabel);

    let hintShown = false;
    const hintBtn = el("button", {
      style: "font-size:var(--text-xs);color:var(--text-faint);text-decoration:underline;margin-top:var(--sp-3)",
      onClick: () => {
        if (!hintShown) { hintShown = true; card.appendChild(el("p", { style: "font-size:var(--text-sm);color:var(--twilight);font-style:italic;margin-top:var(--sp-3)" }, [s.hintText])); }
      }
    }, ["Need a hint?"]);
    card.appendChild(hintBtn);
    screen.appendChild(card);
    app.appendChild(screen);
  }

  // ─── 2. SCRATCH CARD ───────────────────────────────
  function renderScratch(s) {
    const screen = el("div", { className: "screen" });
    screen.append(
      el("div", { className: "stage-label" }, ["Stage " + s.stageLabel]),
      el("div", { className: "stage-icon" }, [s.icon]),
      el("h2", { className: "stage-title" }, [s.title]),
      el("p", { className: "stage-intro" }, [s.intro])
    );

    const container = el("div", { className: "scratch-container" });
    const image = el("img", { src: img(s.scratchImage), alt: "Hidden" });
    const canvas = document.createElement("canvas");
    const overlayText = el("div", { className: "scratch-overlay-text" }, [s.overlayText]);
    container.append(image, canvas, overlayText);

    const caption = el("p", { className: "scratch-caption" }, [s.revealCaption]);
    screen.append(container, caption);

    image.onload = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
      const ctx = canvas.getContext("2d");
      ctx.scale(dpr, dpr);

      const grad = ctx.createLinearGradient(0, 0, rect.width, rect.height);
      grad.addColorStop(0, "#1a2830");
      grad.addColorStop(0.5, "#0d1a20");
      grad.addColorStop(1, "#1a2830");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, rect.width, rect.height);

      for (let i = 0; i < 80; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * rect.width, Math.random() * rect.height, Math.random() * 30 + 5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(143, 179, 201, ${Math.random() * 0.06})`;
        ctx.fill();
      }

      let scratching = false;
      let revealed = false;

      function scratch(x, y) {
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(x, y, 25, 0, Math.PI * 2);
        ctx.fill();
      }

      function getPos(e) {
        const r = canvas.getBoundingClientRect();
        const touch = e.touches ? e.touches[0] : e;
        return { x: touch.clientX - r.left, y: touch.clientY - r.top };
      }

      function checkReveal() {
        if (revealed) return;
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let clear = 0;
        for (let i = 3; i < data.length; i += 16) { if (data[i] === 0) clear++; }
        if (clear / (data.length / 16) > 0.45) {
          revealed = true;
          canvas.style.transition = "opacity .5s";
          canvas.style.opacity = "0";
          overlayText.style.display = "none";
          caption.classList.add("visible");
          sparkle(container);
          setTimeout(() => {
            canvas.remove();
            overlayText.remove();
            const resp = el("div", { className: "response-box" }, [contBtn("Continue", nextStage)]);
            screen.appendChild(resp);
          }, 600);
        }
      }

      canvas.addEventListener("mousedown", e => { scratching = true; const p = getPos(e); scratch(p.x, p.y); });
      canvas.addEventListener("mousemove", e => { if (scratching) { const p = getPos(e); scratch(p.x, p.y); } });
      canvas.addEventListener("mouseup", () => { scratching = false; checkReveal(); });
      canvas.addEventListener("touchstart", e => { e.preventDefault(); scratching = true; const p = getPos(e); scratch(p.x, p.y); }, { passive: false });
      canvas.addEventListener("touchmove", e => { e.preventDefault(); if (scratching) { const p = getPos(e); scratch(p.x, p.y); } }, { passive: false });
      canvas.addEventListener("touchend", () => { scratching = false; checkReveal(); });
    };

    app.appendChild(screen);
  }

  // ─── 3. VOCAB GAME ─────────────────────────────────
  function renderVocab(s) {
    const screen = el("div", { className: "screen" });
    screen.append(
      el("div", { className: "stage-label" }, ["Stage " + s.stageLabel]),
      el("div", { className: "stage-icon" }, [s.icon]),
      el("h2", { className: "stage-title" }, [s.title]),
      el("p", { className: "stage-intro" }, [s.intro])
    );

    const norw = [...s.pairs].sort(() => Math.random() - 0.5);
    const russ = [...s.pairs].sort(() => Math.random() - 0.5);
    let selected = null, matched = 0;

    const cols = el("div", { className: "vocab-columns" });
    const leftCol = el("div", { className: "vocab-col" });
    const rightCol = el("div", { className: "vocab-col" });
    leftCol.appendChild(el("div", { className: "vocab-col-header" }, ["🇳🇴 Norwegian"]));
    rightCol.appendChild(el("div", { className: "vocab-col-header" }, ["🇷🇺 Russian"]));

    function makeTile(word, lang, key) {
      const t = el("button", { className: "vocab-tile" }, [word]);
      t.dataset.lang = lang; t.dataset.key = key;
      t.addEventListener("click", () => {
        if (t.classList.contains("matched")) return;
        if (!selected) { selected = t; t.classList.add("selected"); }
        else if (selected === t) { selected.classList.remove("selected"); selected = null; }
        else if (selected.dataset.lang === t.dataset.lang) { selected.classList.remove("selected"); selected = t; t.classList.add("selected"); }
        else {
          if (selected.dataset.key === t.dataset.key) {
            selected.classList.remove("selected"); selected.classList.add("matched"); t.classList.add("matched");
            sparkle(t);
            matched++; selected = null;
            if (matched === s.pairs.length) {
              setTimeout(() => {
                screen.appendChild(el("div", { className: "response-box" }, [
                  el("p", { className: "response-text" }, [s.successMessage]),
                  contBtn("Continue", nextStage)
                ]));
              }, 400);
            }
          } else {
            t.classList.add("wrong-match"); selected.classList.add("wrong-match");
            const prev = selected;
            setTimeout(() => { t.classList.remove("wrong-match"); prev.classList.remove("wrong-match", "selected"); }, 500);
            selected = null;
          }
        }
      });
      return t;
    }

    norw.forEach(p => leftCol.appendChild(makeTile(p.norwegian, "no", p.english)));
    russ.forEach(p => rightCol.appendChild(makeTile(p.russian, "ru", p.english)));
    cols.append(leftCol, rightCol);
    screen.appendChild(cols);
    app.appendChild(screen);
  }

  // ─── 4. TRIVIA ─────────────────────────────────────
  function renderTrivia(s) {
    let qi = 0;
    function renderQ() {
      const screen = el("div", { className: "screen" });
      if (qi === 0) {
        screen.append(
          el("div", { className: "stage-label" }, ["Stage " + s.stageLabel]),
          el("div", { className: "stage-icon" }, [s.icon]),
          el("h2", { className: "stage-title" }, [s.title]),
          el("p", { className: "stage-intro" }, [s.intro])
        );
      }
      const q = s.questions[qi];
      screen.appendChild(el("p", { className: "trivia-progress" }, [`${qi + 1} / ${s.questions.length}`]));
      const card = el("div", { className: "card-box" });
      card.appendChild(el("p", { className: "trivia-question" }, [q.question]));

      const opts = el("div");
      let answered = false;
      q.options.forEach((o, oi) => {
        const btn = el("button", { className: "option-btn", onClick: () => {
          if (answered) return;
          answered = true;
          opts.querySelectorAll(".option-btn").forEach(b => b.disabled = true);
          if (o.correct) {
            btn.classList.add("correct");
            sparkle(btn);
            const fact = el("div", { className: "fun-fact" }, [q.funFact]);
            card.appendChild(fact);
            setTimeout(() => {
              qi++;
              if (qi < s.questions.length) transitionTo(renderQ);
              else {
                transitionTo(() => {
                  const sc = el("div", { className: "screen" }, [
                    el("div", { className: "stage-icon" }, ["🌑"]),
                    el("div", { className: "response-box" }, [
                      el("p", { className: "response-text" }, [s.successMessage]),
                      contBtn("Continue", nextStage)
                    ])
                  ]);
                  app.appendChild(sc);
                });
              }
            }, 2500);
          } else {
            btn.classList.add("wrong");
            const ci = q.options.findIndex(x => x.correct);
            opts.children[ci].classList.add("correct");
            answered = false;
            setTimeout(() => {
              opts.querySelectorAll(".option-btn").forEach(b => { b.disabled = false; b.classList.remove("wrong", "correct"); });
            }, 1200);
          }
        } }, [o.text]);
        opts.appendChild(btn);
      });
      card.appendChild(opts);
      screen.appendChild(card);
      app.appendChild(screen);
    }
    renderQ();
  }

  // ─── 5. JIGSAW ─────────────────────────────────────
  function renderJigsaw(s) {
    const screen = el("div", { className: "screen start-top" });
    screen.append(
      el("div", { className: "stage-label" }, ["Stage " + s.stageLabel]),
      el("div", { className: "stage-icon" }, [s.icon]),
      el("h2", { className: "stage-title" }, [s.title]),
      el("p", { className: "stage-intro" }, [s.intro])
    );

    const size = s.gridSize;
    const total = size * size;
    const container = el("div", { className: "jigsaw-container" });
    const grid = el("div", { className: "jigsaw-grid", style: `grid-template-columns:repeat(${size},1fr);grid-template-rows:repeat(${size},1fr)` });

    const slots = [];
    for (let i = 0; i < total; i++) {
      const slot = el("div", { className: "jigsaw-target" });
      slot.dataset.idx = i;
      slots.push(slot);
      grid.appendChild(slot);
    }
    container.appendChild(grid);

    const bank = el("div", { className: "jigsaw-bank" });
    const indices = Array.from({ length: total }, (_, i) => i).sort(() => Math.random() - 0.5);
    let placed = 0;
    let selectedPiece = null;

    indices.forEach(idx => {
      const row = Math.floor(idx / size);
      const col = idx % size;
      const piece = el("div", {
        className: "jigsaw-piece",
        style: `width:${Math.floor(280/size)}px;height:${Math.floor(280/size)}px;background-image:url(${img(s.puzzleImage)});background-position:${col * (100/(size-1))}% ${row * (100/(size-1))}%`
      });
      piece.dataset.idx = idx;

      piece.addEventListener("click", () => {
        if (piece.classList.contains("placed")) return;
        bank.querySelectorAll(".jigsaw-piece").forEach(p => p.style.outline = "");
        piece.style.outline = "2px solid var(--accent)";
        selectedPiece = piece;
        slots.forEach(slot => {
          slot.onclick = () => {
            if (slot.children.length > 0) return;
            if (!selectedPiece) return;
            const pieceIdx = parseInt(selectedPiece.dataset.idx);
            const slotIdx = parseInt(slot.dataset.idx);
            if (pieceIdx === slotIdx) {
              selectedPiece.classList.add("placed");
              selectedPiece.style.outline = "";
              selectedPiece.style.width = "100%";
              selectedPiece.style.height = "100%";
              slot.appendChild(selectedPiece);
              sparkle(slot);
              placed++;
              selectedPiece = null;
              if (placed === total) {
                confetti();
                setTimeout(() => {
                  screen.appendChild(el("div", { className: "response-box" }, [
                    el("p", { className: "response-text" }, [s.successMessage]),
                    contBtn("Continue", nextStage)
                  ]));
                }, 500);
              }
            } else {
              slot.style.borderColor = "var(--error)";
              setTimeout(() => { slot.style.borderColor = ""; }, 400);
            }
          };
        });
      });

      bank.appendChild(piece);
    });

    screen.append(container, bank);
    app.appendChild(screen);
  }

  // ─── 6. BOARDING PASS ──────────────────────────────
  function renderBoarding(s) {
    const screen = el("div", { className: "screen" });
    screen.append(
      el("div", { className: "stage-label" }, ["Stage " + s.stageLabel]),
      el("div", { className: "stage-icon" }, [s.icon]),
      el("h2", { className: "stage-title" }, [s.title]),
      el("p", { className: "stage-intro" }, [s.intro])
    );

    const passWrap = el("div", { className: "boarding-pass" });
    const card = el("div", { className: "bp-card" });

    // Front
    const front = el("div", { className: "bp-front" });
    const header = el("div", { className: "bp-header" }, [
      el("div", { className: "bp-airline" }, ["✦ AURORA AIR"]),
      el("div", { className: "bp-flight" }, [s.pass.flight])
    ]);

    const route = el("div", { className: "bp-route" }, [
      el("div", { className: "bp-city" }, [
        el("div", { className: "bp-city-code" }, [s.pass.from.substring(0, 3).toUpperCase()]),
        el("div", { className: "bp-city-name" }, [s.pass.from])
      ]),
      el("div", { className: "bp-arrow", innerHTML: "✈︎" }),
      el("div", { className: "bp-city" }, [
        el("div", { className: "bp-city-code" }, [s.pass.to]),
        el("div", { className: "bp-city-name" }, ["Destination"])
      ])
    ]);

    const details = el("div", { className: "bp-details" }, [
      el("div", {}, [el("div", { className: "bp-detail-label" }, ["Passenger"]), el("div", { className: "bp-detail-value" }, [s.pass.passenger])]),
      el("div", {}, [el("div", { className: "bp-detail-label" }, ["Class"]), el("div", { className: "bp-detail-value" }, [s.pass.seatClass])]),
      el("div", {}, [el("div", { className: "bp-detail-label" }, ["Date"]), el("div", { className: "bp-detail-value" }, [s.pass.date])]),
      el("div", {}, [el("div", { className: "bp-detail-label" }, ["Gate"]), el("div", { className: "bp-detail-value" }, [s.pass.gate])]),
    ]);

    const barcode = el("div", { className: "bp-barcode" });
    for (let i = 0; i < 50; i++) {
      const bar = el("div", { className: "bp-barcode-bar" });
      bar.style.height = (20 + Math.random() * 20) + "px";
      bar.style.width = (Math.random() > 0.3 ? 2 : 3) + "px";
      barcode.appendChild(bar);
    }

    front.append(header, route, details, barcode, el("div", { className: "bp-barcode-hint" }, ["↑ Tap the barcode to scan"]));

    // Back (reveal)
    const back = el("div", { className: "bp-back" }, [
      el("div", { className: "bp-destination" }, [s.revealDestination]),
      el("div", { className: "bp-poem" }, [s.poem.georgian]),
      el("div", { className: "bp-poem" }, [s.poem.english]),
      el("div", { className: "bp-poem-attr" }, [s.poem.attribution]),
      el("p", { className: "bp-reveal-msg" }, [s.revealMessage])
    ]);

    card.append(front, back);
    passWrap.appendChild(card);

    barcode.addEventListener("click", () => {
      card.classList.add("flipped");
      confetti();
      setTimeout(() => {
        screen.appendChild(el("div", { className: "response-box" }, [contBtn("Continue", nextStage)]));
      }, 1500);
    });

    screen.appendChild(passWrap);
    app.appendChild(screen);
  }

  // ─── 7. FINALE ─────────────────────────────────────
  function renderFinale(s) {
    confetti();
    const screen = el("div", { className: "screen start-top" });
    screen.append(
      el("div", { className: "stage-label" }, [s.stageLabel]),
      el("div", { className: "stage-icon", style: "font-size:3rem" }, [s.icon]),
      el("h2", { className: "stage-title", style: "margin-bottom:var(--sp-8)" }, [s.title])
    );

    if (s.avatarImage) {
      screen.appendChild(el("div", { className: "avatar-frame" }, [el("img", { src: img(s.avatarImage), alt: "Us" })]));
    }

    screen.appendChild(el("div", { className: "finale-letter" }, [s.letter]));

    if (s.photo) {
      screen.appendChild(el("div", { className: "photo-frame" }, [el("img", { src: img(s.photo), alt: "Us" })]));
    }

    // Countdown
    const box = el("div", { className: "countdown-box" });
    box.appendChild(el("div", { className: "countdown-label" }, ["Until Bali"]));
    const timer = el("div", { className: "countdown-timer" });
    ["days", "hours", "minutes", "seconds"].forEach(unit => {
      timer.appendChild(el("div", { className: "countdown-unit" }, [
        el("div", { className: "countdown-number", id: "cd-" + unit[0] }, ["--"]),
        el("div", { className: "countdown-unit-label" }, [unit])
      ]));
    });
    box.appendChild(timer);
    screen.appendChild(box);

    // Bonus battleship button
    screen.appendChild(el("button", { className: "bonus-btn", onClick: () => transitionTo(renderBattleship) }, ["⚔️ Unlock Bonus: Naval Battle"]));

    // Creative touch: replay from start button
    screen.appendChild(el("button", {
      className: "replay-btn",
      onClick: () => { currentStage = -1; updateProgress(); app.innerHTML = ""; renderCard(); }
    }, ["🎬 Play it again"]));

    app.appendChild(screen);

    // Start countdown
    const els = { d: screen.querySelector("#cd-d"), h: screen.querySelector("#cd-h"), m: screen.querySelector("#cd-m"), s: screen.querySelector("#cd-s") };
    function tick() {
      const diff = new Date(CONTENT.baliDate).getTime() - Date.now();
      if (diff <= 0 || !els.d) return;
      els.d.textContent = Math.floor(diff / 864e5);
      els.h.textContent = Math.floor(diff / 36e5 % 24);
      els.m.textContent = Math.floor(diff / 6e4 % 60);
      els.s.textContent = Math.floor(diff / 1e3 % 60);
    }
    tick(); setInterval(tick, 1000);
  }

  // ─── BATTLESHIP ────────────────────────────────────
  function renderBattleship() {
    const BS = CONTENT.battleship;
    const size = BS.gridSize;
    const grid = Array.from({ length: size }, () => Array(size).fill(0));
    const shots = Array.from({ length: size }, () => Array(size).fill(false));
    let remaining = 0;

    // Place ships from admin placements or random
    if (BS.placements && BS.placements.length === BS.ships.length) {
      BS.placements.forEach((p, i) => {
        const ship = BS.ships[i];
        for (let j = 0; j < ship.size; j++) {
          const r = p.horizontal ? p.row : p.row + j;
          const c = p.horizontal ? p.col + j : p.col;
          if (r < size && c < size) { grid[r][c] = 1; remaining++; }
        }
      });
    } else {
      BS.ships.forEach(ship => {
        let placed = false;
        while (!placed) {
          const h = Math.random() > 0.5;
          const r = Math.floor(Math.random() * (h ? size : size - ship.size + 1));
          const c = Math.floor(Math.random() * (h ? size - ship.size + 1 : size));
          let ok = true;
          for (let j = 0; j < ship.size; j++) {
            if (grid[h ? r : r + j][h ? c + j : c]) { ok = false; break; }
          }
          if (ok) {
            for (let j = 0; j < ship.size; j++) {
              grid[h ? r : r + j][h ? c + j : c] = 1; remaining++;
            }
            placed = true;
          }
        }
      });
    }

    const screen = el("div", { className: "screen start-top" });
    screen.append(
      el("div", { className: "stage-label" }, ["Bonus"]),
      el("div", { className: "stage-icon" }, ["⚔️"]),
      el("h2", { className: "stage-title" }, [BS.title]),
      el("p", { style: "font-size:var(--text-sm);color:var(--text-muted);margin-bottom:var(--sp-6);max-width:440px;text-align:center" }, [BS.intro])
    );

    const status = el("p", { className: "bs-status" }, ["Tap a cell to fire!"]);
    screen.appendChild(status);

    const gridEl = el("div", { className: "bs-grid", style: `grid-template-columns:repeat(${size},1fr)` });
    screen.appendChild(el("div", { className: "bs-grid-label" }, ["Enemy Waters"]));

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const cell = el("button", { className: "bs-cell clickable" });
        cell.addEventListener("click", () => {
          if (shots[r][c]) return;
          shots[r][c] = true;
          cell.classList.remove("clickable");
          if (grid[r][c]) {
            cell.classList.add("hit"); cell.textContent = "💥";
            remaining--;
            status.textContent = remaining > 0 ? "Direct hit! 🔥" : "You sank my entire fleet! The Princess wins. 👑";
            if (remaining === 0) {
              confetti();
              sparkle(gridEl);
              gridEl.querySelectorAll(".clickable").forEach(c => c.classList.remove("clickable"));
            }
          } else { cell.classList.add("miss"); cell.textContent = "·"; status.textContent = "Miss…"; }
        });
        gridEl.appendChild(cell);
      }
    }

    screen.appendChild(gridEl);
    screen.appendChild(el("button", {
      className: "btn-continue", style: "margin-top:var(--sp-8)",
      onClick: () => { currentStage = totalStages() - 1; transitionTo(() => renderFinale(CONTENT.stages[totalStages() - 1])); }
    }, ["← Back to finale"]));
    app.appendChild(screen);
  }

  // ─── PUBLIC API ────────────────────────────────────
  window.APP = {
    rerender() { if (currentStage < 0) { app.innerHTML = ""; renderCard(); } else { const s = CONTENT.stages[currentStage]; if (s) goToStage(currentStage); } },
    goToLanding() { currentStage = -1; updateProgress(); app.innerHTML = ""; renderCard(); },
    goToStage(i) { goToStage(i); }
  };

  // ─── INIT ──────────────────────────────────────────
  function init() { initParticles(); initMusic(); initCrownEasterEgg(); renderCard(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
