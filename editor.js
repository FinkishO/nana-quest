/* ═══════════════════════════════════════════════════
   V2 CONTENT EDITOR + BATTLESHIP PLACEMENT
   Access: tap "Tap to open" text 5× on the envelope screen
   Or add #editor to the URL
   ═══════════════════════════════════════════════════ */

(function () {
  "use strict";

  let editorOpen = false;
  let tapCount = 0;
  let tapTimer = null;

  // ─── ACTIVATION ───────────────────────────────────
  function initEditorTrigger() {
    if (window.location.hash === "#editor") {
      setTimeout(openEditor, 600);
    }
    // 5 taps on the "Tap to open" hint text or envelope area
    document.addEventListener("click", (e) => {
      // Target: the small "Tap to open" text, or the envelope container
      const target = e.target.closest(".envelope-container, [style*='text-transform:uppercase']");
      if (!target) { tapCount = 0; return; }
      tapCount++;
      clearTimeout(tapTimer);
      tapTimer = setTimeout(() => { tapCount = 0; }, 2500);
      if (tapCount >= 5) {
        tapCount = 0;
        openEditor();
      }
    });
  }

  // ─── EDITOR OVERLAY ───────────────────────────────
  function openEditor() {
    if (editorOpen) return;
    editorOpen = true;

    const overlay = document.createElement("div");
    overlay.id = "editor-overlay";
    overlay.innerHTML = `
      <div class="editor-panel">
        <div class="editor-header">
          <h2 class="editor-title">✏️ Content Editor</h2>
          <div class="editor-header-actions">
            <button class="editor-save-btn" id="editor-apply">Apply Changes</button>
            <button class="editor-close-btn" id="editor-close">✕</button>
          </div>
        </div>
        <div class="editor-tabs">
          <div class="editor-tab active" data-tab="content">Content</div>
          <div class="editor-tab" data-tab="battleship">⚔️ Battleship</div>
        </div>
        <div class="editor-body" id="editor-body">
          <div class="editor-tab-content active" id="tab-content"></div>
          <div class="editor-tab-content" id="tab-battleship"></div>
        </div>
        <div class="editor-footer">
          <p class="editor-footer-note">"Apply Changes" updates the live preview instantly. Use "Download content.js" to save a backup.</p>
          <div class="editor-footer-actions">
            <button class="editor-export-btn" id="editor-preview">▶ Preview from start</button>
            <button class="editor-export-btn" id="editor-copy">📋 Copy content.js</button>
            <button class="editor-export-btn" id="editor-download">💾 Download content.js</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    buildContentTab();
    buildBattleshipTab();

    // Tab switching
    overlay.querySelectorAll(".editor-tab").forEach(tab => {
      tab.addEventListener("click", () => {
        overlay.querySelectorAll(".editor-tab").forEach(t => t.classList.remove("active"));
        overlay.querySelectorAll(".editor-tab-content").forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        document.getElementById("tab-" + tab.dataset.tab).classList.add("active");
      });
    });

    document.getElementById("editor-close").addEventListener("click", closeEditor);
    document.getElementById("editor-apply").addEventListener("click", applyChanges);
    document.getElementById("editor-copy").addEventListener("click", copyContent);
    document.getElementById("editor-download").addEventListener("click", downloadContent);
    document.getElementById("editor-preview").addEventListener("click", () => {
      applyChanges();
      closeEditor();
      if (window.APP && window.APP.goToLanding) window.APP.goToLanding();
    });

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeEditor();
    });
  }

  function closeEditor() {
    const overlay = document.getElementById("editor-overlay");
    if (overlay) overlay.remove();
    editorOpen = false;
  }

  // ═══════════════════════════════════════════════════
  //  CONTENT TAB
  // ═══════════════════════════════════════════════════
  function buildContentTab() {
    const body = document.getElementById("tab-content");
    let html = "";

    // Basic Settings
    html += section("Basic Settings", `
      ${field("herName", "Her Name", CONTENT.herName)}
      ${field("yourSignature", "Your Signature", CONTENT.yourSignature)}
      ${field("baliDate", "Bali Date (YYYY-MM-DD)", CONTENT.baliDate.split("T")[0], "date")}
    `);

    // Birthday Card
    html += section("Birthday Card (Envelope)", `
      ${field("card.envelopeLabel", "Envelope Label", CONTENT.card.envelopeLabel)}
      ${field("card.frontMessage", "Front Message (Georgian)", CONTENT.card.frontMessage)}
      ${field("card.frontSubtitle", "Front Subtitle", CONTENT.card.frontSubtitle)}
      ${textarea("card.insideMessage", "Inside Message", CONTENT.card.insideMessage, 10)}
      ${field("card.buttonText", "Button Text", CONTENT.card.buttonText)}
    `);

    // Each stage
    CONTENT.stages.forEach((stage, i) => {
      html += buildStageEditor(stage, i);
    });

    // Battleship settings (text only — placement is on the other tab)
    html += section("Bonus: Battleship (text)", `
      ${field("battleship.title", "Title", CONTENT.battleship.title)}
      ${textarea("battleship.intro", "Intro Text", CONTENT.battleship.intro)}
      ${field("battleship.gridSize", "Grid Size", CONTENT.battleship.gridSize, "number")}
    `);

    body.innerHTML = html;

    // Collapsible sections
    body.querySelectorAll(".editor-section-header").forEach(header => {
      header.addEventListener("click", () => {
        const content = header.nextElementSibling;
        const arrow = header.querySelector(".editor-arrow");
        content.classList.toggle("collapsed");
        arrow.textContent = content.classList.contains("collapsed") ? "▸" : "▾";
      });
    });
  }

  function buildStageEditor(stage, index) {
    let fields = "";
    const p = `stages.${index}`;

    fields += field(`${p}.stageLabel`, "Stage Label", stage.stageLabel);
    fields += field(`${p}.icon`, "Icon (emoji)", stage.icon);
    fields += field(`${p}.title`, "Title", stage.title);
    fields += textarea(`${p}.intro`, "Intro Text", stage.intro);

    switch (stage.type) {
      case "cipher":
        fields += field(`${p}.cipherShift`, "Cipher Shift (number)", stage.cipherShift, "number");
        fields += textarea(`${p}.plainText`, "Hidden Message (plaintext)", stage.plainText);
        fields += textarea(`${p}.successMessage`, "Success Message", stage.successMessage);
        fields += field(`${p}.hintText`, "Hint Text", stage.hintText);
        break;

      case "scratch":
        fields += field(`${p}.scratchImage`, "Image filename (no .jpg)", stage.scratchImage);
        fields += textarea(`${p}.revealCaption`, "Caption after reveal", stage.revealCaption);
        fields += field(`${p}.overlayText`, "Overlay Text", stage.overlayText);
        break;

      case "vocab-game":
        stage.pairs.forEach((pair, pi) => {
          fields += `<div class="editor-vocab-row">
            <span class="editor-vocab-label">Pair ${pi + 1}:</span>
            ${smallField(`${p}.pairs.${pi}.norwegian`, "Norwegian", pair.norwegian)}
            ${smallField(`${p}.pairs.${pi}.russian`, "Russian", pair.russian)}
            ${smallField(`${p}.pairs.${pi}.english`, "English", pair.english)}
          </div>`;
        });
        fields += textarea(`${p}.successMessage`, "Success Message", stage.successMessage);
        break;

      case "trivia":
        stage.questions.forEach((q, qi) => {
          fields += `<div class="editor-subquestion">
            <div class="editor-choice-label">Question ${qi + 1}</div>
            ${textarea(`${p}.questions.${qi}.question`, "Question", q.question, 2)}
            ${textarea(`${p}.questions.${qi}.funFact`, "Fun Fact", q.funFact, 2)}`;
          q.options.forEach((opt, oi) => {
            fields += field(`${p}.questions.${qi}.options.${oi}.text`, `Option ${oi + 1}${opt.correct ? " ✓ (correct)" : ""}`, opt.text);
          });
          fields += `</div>`;
        });
        fields += textarea(`${p}.successMessage`, "Success Message", stage.successMessage);
        break;

      case "jigsaw":
        fields += field(`${p}.puzzleImage`, "Image filename (no .jpg)", stage.puzzleImage);
        fields += field(`${p}.gridSize`, "Grid Size (e.g. 4)", stage.gridSize, "number");
        fields += textarea(`${p}.successMessage`, "Success Message", stage.successMessage);
        break;

      case "boarding-pass":
        fields += field(`${p}.pass.from`, "From City", stage.pass.from);
        fields += field(`${p}.pass.to`, "To (mystery text)", stage.pass.to);
        fields += field(`${p}.pass.passenger`, "Passenger Name", stage.pass.passenger);
        fields += field(`${p}.pass.seatClass`, "Seat Class", stage.pass.seatClass);
        fields += field(`${p}.pass.flight`, "Flight Number", stage.pass.flight);
        fields += field(`${p}.pass.gate`, "Gate", stage.pass.gate);
        fields += field(`${p}.pass.date`, "Date Text", stage.pass.date);
        fields += field(`${p}.revealDestination`, "Reveal Destination", stage.revealDestination);
        fields += textarea(`${p}.poem.georgian`, "Poem (Georgian)", stage.poem.georgian);
        fields += textarea(`${p}.poem.english`, "Poem (English)", stage.poem.english);
        fields += field(`${p}.poem.attribution`, "Poem Attribution", stage.poem.attribution);
        fields += textarea(`${p}.revealMessage`, "Reveal Message", stage.revealMessage);
        break;

      case "finale":
        fields += textarea(`${p}.letter`, "Finale Message", stage.letter, 12);
        fields += field(`${p}.photo`, "Photo filename (no .jpg)", stage.photo);
        fields += field(`${p}.avatarImage`, "Avatar image filename (no .jpg)", stage.avatarImage);
        break;
    }

    const typeLabels = {
      cipher: "Cipher", scratch: "Scratch Card", "vocab-game": "Vocab Game",
      trivia: "Trivia", jigsaw: "Jigsaw", "boarding-pass": "Boarding Pass", finale: "Finale"
    };
    return section(`${stage.stageLabel}: ${stage.title} (${typeLabels[stage.type] || stage.type})`, fields);
  }

  // ═══════════════════════════════════════════════════
  //  BATTLESHIP PLACEMENT TAB
  // ═══════════════════════════════════════════════════
  function buildBattleshipTab() {
    const tab = document.getElementById("tab-battleship");
    const BS = CONTENT.battleship;
    const size = BS.gridSize;

    // State
    let placements = [];
    if (BS.placements && BS.placements.length === BS.ships.length) {
      placements = BS.placements.map(p => ({ ...p }));
    } else {
      placements = BS.ships.map(() => null);
    }
    let activeShip = placements.findIndex(p => p === null);
    if (activeShip === -1) activeShip = 0;
    let horizontal = true;
    let hoverCell = null;

    function render() {
      let html = `
        <div class="bs-placement-wrap">
          <p class="bs-placement-info">
            Place your ships on the grid below. Nana will try to find them.<br>
            <strong>Click a ship</strong> to select it, then <strong>click a cell</strong> to place it.<br>
            Use <strong>Rotate</strong> to switch between horizontal and vertical.
          </p>
          <div class="bs-ship-list" id="bs-ship-list">
      `;
      BS.ships.forEach((ship, i) => {
        const isActive = i === activeShip;
        const isPlaced = placements[i] !== null;
        const cls = isActive ? "active" : (isPlaced ? "placed" : "");
        let dots = "";
        for (let d = 0; d < ship.size; d++) dots += `<div class="bs-ship-dot"></div>`;
        html += `<div class="bs-ship-item ${cls}" data-ship="${i}">
          <span>${ship.name} (${ship.size})</span>
          <div class="bs-ship-dots">${dots}</div>
        </div>`;
      });
      html += `</div>`;

      html += `<div class="bs-controls">
        <button class="bs-ctrl-btn" id="bs-rotate">↻ Rotate</button>
        <button class="bs-ctrl-btn danger" id="bs-clear">Clear All</button>
        <button class="bs-ctrl-btn success" id="bs-save">✓ Save Placements</button>
      </div>`;

      html += `<div class="bs-orient-label">Current: ${horizontal ? "→ Horizontal" : "↓ Vertical"}</div>`;
      html += `<div class="bs-grid-label">Your Waters (place ships here)</div>`;
      html += `<div class="bs-grid" style="grid-template-columns:repeat(${size},1fr);max-width:${size * 46}px;margin:0 auto" id="bs-placement-grid">`;

      // Build grid state
      const gridState = Array.from({ length: size }, () => Array(size).fill(-1));
      placements.forEach((p, i) => {
        if (!p) return;
        const ship = BS.ships[i];
        for (let j = 0; j < ship.size; j++) {
          const r = p.horizontal ? p.row : p.row + j;
          const c = p.horizontal ? p.col + j : p.col;
          if (r < size && c < size) gridState[r][c] = i;
        }
      });

      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          let cls = "bs-cell";
          if (gridState[r][c] >= 0) {
            cls += gridState[r][c] === activeShip ? " preview-valid" : " ship-placed";
          }
          html += `<div class="${cls}" data-r="${r}" data-c="${c}"></div>`;
        }
      }

      html += `</div></div>`;
      tab.innerHTML = html;

      // Ship selection
      tab.querySelectorAll(".bs-ship-item").forEach(el => {
        el.addEventListener("click", () => {
          activeShip = parseInt(el.dataset.ship);
          render();
        });
      });

      // Rotate
      document.getElementById("bs-rotate").addEventListener("click", () => {
        horizontal = !horizontal;
        render();
      });

      // Clear
      document.getElementById("bs-clear").addEventListener("click", () => {
        placements = BS.ships.map(() => null);
        activeShip = 0;
        render();
      });

      // Save
      document.getElementById("bs-save").addEventListener("click", () => {
        const allPlaced = placements.every(p => p !== null);
        if (!allPlaced) {
          alert("Place all ships before saving!");
          return;
        }
        BS.placements = placements.map(p => ({ ...p }));
        const btn = document.getElementById("bs-save");
        btn.textContent = "✓ Saved!";
        setTimeout(() => { btn.textContent = "✓ Save Placements"; }, 1500);
      });

      // Grid hover + click
      const grid = document.getElementById("bs-placement-grid");
      grid.addEventListener("mouseover", (e) => {
        const cell = e.target.closest(".bs-cell");
        if (!cell) return;
        const r = parseInt(cell.dataset.r);
        const c = parseInt(cell.dataset.c);
        previewShip(r, c);
      });
      grid.addEventListener("mouseleave", () => clearPreview());
      grid.addEventListener("click", (e) => {
        const cell = e.target.closest(".bs-cell");
        if (!cell) return;
        const r = parseInt(cell.dataset.r);
        const c = parseInt(cell.dataset.c);
        placeShip(r, c);
      });
    }

    function previewShip(row, col) {
      if (activeShip < 0 || activeShip >= BS.ships.length) return;
      const ship = BS.ships[activeShip];
      const grid = document.getElementById("bs-placement-grid");
      if (!grid) return;
      const cells = grid.querySelectorAll(".bs-cell");

      // Clear existing previews
      cells.forEach(c => c.classList.remove("preview-valid", "preview-invalid"));

      // Check if valid
      const valid = canPlace(row, col, ship.size, horizontal, activeShip);
      for (let j = 0; j < ship.size; j++) {
        const r = horizontal ? row : row + j;
        const c = horizontal ? col + j : col;
        if (r >= BS.gridSize || c >= BS.gridSize) continue;
        const idx = r * BS.gridSize + c;
        if (cells[idx]) {
          cells[idx].classList.add(valid ? "preview-valid" : "preview-invalid");
        }
      }
    }

    function clearPreview() {
      const grid = document.getElementById("bs-placement-grid");
      if (!grid) return;
      grid.querySelectorAll(".bs-cell").forEach(c => {
        c.classList.remove("preview-valid", "preview-invalid");
      });
    }

    function canPlace(row, col, shipSize, horiz, ignoreIdx) {
      for (let j = 0; j < shipSize; j++) {
        const r = horiz ? row : row + j;
        const c = horiz ? col + j : col;
        if (r >= BS.gridSize || c >= BS.gridSize) return false;
        // Check overlap with other placed ships
        for (let si = 0; si < placements.length; si++) {
          if (si === ignoreIdx || !placements[si]) continue;
          const other = placements[si];
          const otherShip = BS.ships[si];
          for (let k = 0; k < otherShip.size; k++) {
            const or = other.horizontal ? other.row : other.row + k;
            const oc = other.horizontal ? other.col + k : other.col;
            if (r === or && c === oc) return false;
          }
        }
      }
      return true;
    }

    function placeShip(row, col) {
      if (activeShip < 0 || activeShip >= BS.ships.length) return;
      const ship = BS.ships[activeShip];
      if (!canPlace(row, col, ship.size, horizontal, activeShip)) return;

      placements[activeShip] = { row, col, horizontal };

      // Auto-advance to next unplaced ship
      const nextUnplaced = placements.findIndex(p => p === null);
      if (nextUnplaced >= 0) activeShip = nextUnplaced;

      render();
    }

    render();
  }

  // ═══════════════════════════════════════════════════
  //  HTML HELPERS
  // ═══════════════════════════════════════════════════
  function section(title, content) {
    return `
      <div class="editor-section">
        <div class="editor-section-header">
          <span class="editor-arrow">▾</span> ${escHtml(title)}
        </div>
        <div class="editor-section-content">${content}</div>
      </div>`;
  }

  function field(path, label, value, type = "text") {
    return `
      <div class="editor-field">
        <label class="editor-label">${escHtml(label)}</label>
        <input class="editor-input" type="${type}" data-path="${escHtml(path)}" value="${escAttr(String(value))}" />
      </div>`;
  }

  function smallField(path, label, value) {
    return `
      <div class="editor-field editor-field-small">
        <label class="editor-label editor-label-small">${escHtml(label)}</label>
        <input class="editor-input" type="text" data-path="${escHtml(path)}" value="${escAttr(String(value))}" />
      </div>`;
  }

  function textarea(path, label, value, rows = 4) {
    return `
      <div class="editor-field">
        <label class="editor-label">${escHtml(label)}</label>
        <textarea class="editor-textarea" data-path="${escHtml(path)}" rows="${rows}">${escHtml(String(value))}</textarea>
      </div>`;
  }

  function escHtml(s) {
    const d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  function escAttr(s) {
    return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // ═══════════════════════════════════════════════════
  //  APPLY / EXPORT
  // ═══════════════════════════════════════════════════
  function applyChanges() {
    const inputs = document.querySelectorAll("#tab-content [data-path]");
    inputs.forEach(input => {
      const path = input.dataset.path;
      const value = input.tagName === "TEXTAREA" ? input.value : input.value;
      setNestedValue(CONTENT, path, value);
    });

    // baliDate needs time suffix
    const baliInput = document.querySelector('[data-path="baliDate"]');
    if (baliInput) {
      CONTENT.baliDate = baliInput.value + "T00:00:00";
    }

    // Re-render
    if (window.APP && window.APP.rerender) {
      window.APP.rerender();
    }

    // Flash success
    const btn = document.getElementById("editor-apply");
    const orig = btn.textContent;
    btn.textContent = "✓ Applied!";
    btn.style.background = "var(--success)";
    setTimeout(() => { btn.textContent = orig; btn.style.background = ""; }, 1500);
  }

  function setNestedValue(obj, path, value) {
    const keys = path.split(".");
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      const key = isNaN(keys[i]) ? keys[i] : parseInt(keys[i]);
      current = current[key];
      if (!current) return;
    }
    const lastKey = isNaN(keys[keys.length - 1]) ? keys[keys.length - 1] : parseInt(keys[keys.length - 1]);
    if (typeof current[lastKey] === "number") {
      current[lastKey] = Number(value) || current[lastKey];
    } else if (typeof current[lastKey] === "boolean") {
      current[lastKey] = value === "true";
    } else {
      current[lastKey] = value;
    }
  }

  // ─── EXPORT ───────────────────────────────────────
  function generateContentJS() {
    return "const CONTENT = " + jsonToJS(CONTENT, 0) + ";\n";
  }

  function jsonToJS(obj, indent) {
    const pad = "  ".repeat(indent);
    const pad1 = "  ".repeat(indent + 1);
    if (obj === null) return "null";
    if (Array.isArray(obj)) {
      if (obj.length === 0) return "[]";
      const items = obj.map(item => pad1 + jsonToJS(item, indent + 1));
      return "[\n" + items.join(",\n") + "\n" + pad + "]";
    }
    if (typeof obj === "object") {
      const entries = Object.entries(obj);
      if (entries.length === 0) return "{}";
      const lines = entries.map(([key, val]) => {
        const k = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : JSON.stringify(key);
        return pad1 + k + ": " + jsonToJS(val, indent + 1);
      });
      return "{\n" + lines.join(",\n") + "\n" + pad + "}";
    }
    if (typeof obj === "string") {
      if (obj.includes("\n")) return "`" + obj.replace(/`/g, "\\`") + "`";
      return JSON.stringify(obj);
    }
    return String(obj);
  }

  function copyContent() {
    applyChanges();
    const text = generateContentJS();
    navigator.clipboard.writeText(text).then(() => {
      const btn = document.getElementById("editor-copy");
      const orig = btn.textContent;
      btn.textContent = "✓ Copied!";
      setTimeout(() => { btn.textContent = orig; }, 2000);
    }).catch(() => {
      const ta = document.createElement("textarea");
      ta.value = text; document.body.appendChild(ta); ta.select();
      document.execCommand("copy"); ta.remove();
      const btn = document.getElementById("editor-copy");
      btn.textContent = "✓ Copied!";
      setTimeout(() => { btn.textContent = "📋 Copy content.js"; }, 2000);
    });
  }

  function downloadContent() {
    applyChanges();
    const text = generateContentJS();
    const blob = new Blob([text], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "content.js"; a.click();
    URL.revokeObjectURL(url);
  }

  // ─── INIT ─────────────────────────────────────────
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initEditorTrigger);
  } else {
    initEditorTrigger();
  }
})();
