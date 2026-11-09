/* ==========================================================
   LA BÜTIQUE — Club « Bütique Army », gamification & écosystème π
   Bütique Points, succès, rangs, carte de fidélité, chasse au π,
   Bücoin, NFT « Accords Bütiques », méditation de pleine conscience.
   Les autres scripts signalent les actions par :
   document.dispatchEvent(new CustomEvent("bq", { detail: "id-du-succès" }))
   ========================================================== */
(() => {
  "use strict";

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const NB = " ";
  const num = new Intl.NumberFormat("fr-FR");
  const eur = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });
  const still = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- État (stocké dans ce navigateur uniquement) ---------- */
  const KEY = "butique-army";
  let state = { points: 0, ach: {}, pis: [], minted: [], waited: 0 };
  try { Object.assign(state, JSON.parse(localStorage.getItem(KEY)) || {}); } catch { /* état éphémère */ }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* slow-storage */ } };

  /* ---------- Succès ---------- */
  const ACH = {
    "cookie-refuse": ["Rebelle du consentement", 31],
    "cookie-conscious": ["Consentement éclairé", 14],
    "cart-add": ["Premier accueil", 10],
    "delfine-add": ["Hyperfocus acquis", 16],
    "checkout-3": ["Persévérance inutile", 42],
    "book": ["Agenda chargé", 12],
    "waitlist": ["Candidat·e à l'attente", 50],
    "piday": ["Employabilité +3,14", 31],
    "bot-open": ["A parlé à Bütler", 15],
    "bot-human": ["A réclamé un humain", 27],
    "kofi": ["Mécène du décaféiné", 99],
    "linktree": ["A tenté de joindre π", 21],
    "meditation": ["Pleine conscience certifiée", 108],
    "bucoin": ["Early adopter vibratoire", 52],
    "nft": ["Collectionneur·se unique", 50],
    "card": ["Membre de l'Army", 20],
    "pi-hunt": ["Chasseur·se de π", 314],
    "cowaiting": ["Co-waiter d'élite", 47],
    "code": ["Initié·e au code", 31],
    "selfie": ["Visage aligné", 14],
    "catering": ["Cuisine centrale démasquée", 33],
    "mini-add": ["Parentalité premium", 21],
    "living": ["Locataire méritant·e", 33],
    "merit": ["Méritocrate", 14],
    "instagram": ["Abonné·e conscient·e", 21],
  };
  const PI_TOTAL = 7, PI_PTS = 14;

  const TIERS = [
    { id: "curieux", name: "Curieux·se", min: 0, color: "#f1ede2" },
    { id: "initie", name: "Initié·e", min: 100, color: "#d7ff1e" },
    { id: "ambassadeur", name: "Ambassadeur·rice", min: 300, color: "#ff3fa4" },
    { id: "cercle", name: "Cercle π", min: 600, color: "#2d2dff" },
    { id: "majuscule", name: "Π (majuscule)", min: 3141, color: "#0b0b0b" },
  ];
  const tierOf = (p) => TIERS.filter((t) => p >= t.min).pop();
  const nextTier = (p) => TIERS.find((t) => t.min > p);

  /* ---------- Notifications de succès ---------- */
  const pop = document.createElement("div");
  pop.className = "ach-pop";
  pop.setAttribute("role", "status");
  pop.setAttribute("aria-live", "polite");
  document.body.appendChild(pop);
  let popTimer;
  function notify(title, pts, sub = "Succès débloqué") {
    pop.innerHTML = `<span class="ach-ico" aria-hidden="true">🏆</span><span><small>${sub}</small><strong></strong></span><b>+${pts}</b>`;
    pop.querySelector("strong").textContent = title;
    pop.classList.add("show");
    clearTimeout(popTimer);
    popTimer = setTimeout(() => pop.classList.remove("show"), 3600);
  }

  function addPoints(n) {
    const before = tierOf(state.points);
    state.points += n;
    save();
    render();
    const after = tierOf(state.points);
    if (after !== before) setTimeout(() => notify(`Nouveau rang : ${after.name}`, 0, "Promotion"), 3800);
  }
  function unlock(id) {
    const a = ACH[id];
    if (!a || state.ach[id]) return;
    state.ach[id] = Date.now();
    notify(a[0], a[1]);
    addPoints(a[1]);
  }
  document.addEventListener("bq", (e) => unlock(e.detail));
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[href]");
    if (!a) return;
    if (a.href.includes("ko-fi.com")) unlock("kofi");
    else if (a.href.includes("picard.fr")) unlock("catering");
    else if (a.href.includes("instagram.com")) unlock("instagram");
    else if (a.href.includes("linktr.ee")) unlock("linktree");
  });

  /* ---------- Affichage (barre live, club) ---------- */
  function render() {
    const p = state.points;
    $$("[data-bq-points]").forEach((el) => (el.textContent = num.format(p)));
    const t = tierOf(p), n = nextTier(p);
    $$("[data-bq-tier]").forEach((el) => (el.textContent = t.name));
    const bar = $("#club-progress");
    if (bar) {
      const pct = n ? Math.min(100, ((p - t.min) / (n.min - t.min)) * 100) : 100;
      bar.style.width = pct + "%";
      $("#club-next").textContent = n
        ? (n.id === "majuscule" ? `Prochain rang : ${n.name}, à ${num.format(n.min)} pts (inatteignable par conception)` : `Prochain rang : ${n.name}, encore ${num.format(n.min - p)} pts`)
        : "Rang maximal atteint. Ce qui est, en soi, impossible.";
    }
    $$(".tier").forEach((el) => el.classList.toggle("current", el.dataset.tier === t.id));
    const list = $("#ach-list");
    if (list) {
      const ids = Object.keys(ACH);
      const locked = ids.filter((id) => !state.ach[id]).length;
      list.innerHTML = ids.filter((id) => state.ach[id])
        .map((id) => `<li class="done"><span>🏆</span><span>${ACH[id][0]}</span><b>+${ACH[id][1]}</b></li>`).join("")
        + (locked ? `<li><span>🔒</span><span>${locked} succès encore secrets. Explorez, cliquez, persévérez inutilement.</span><b>+?</b></li>` : "");
      $("#ach-count").textContent = `${Object.keys(state.ach).length}/${ids.length}`;
    }
    const ph = $("#pi-hunt-count");
    if (ph) ph.textContent = `${state.pis.length}/${PI_TOTAL}`;
  }

  /* ---------- Chasse au π ---------- */
  const shine = document.createElement("div");
  shine.className = "shiny-layer";
  shine.setAttribute("aria-hidden", "true");
  document.body.appendChild(shine);

  function shiny() {
    document.body.classList.add("shiny");
    setTimeout(() => document.body.classList.remove("shiny"), 3140);
  }
  function congrats() {
    const d = $("#pi-congrats");
    d.hidden = false;
    $(".pi-congrats-close", d).focus();
    shiny();
  }
  $$(".pi-hunt").forEach((b) => {
    const id = b.dataset.pi;
    if (state.pis.includes(id)) b.classList.add("found");
    b.addEventListener("click", () => {
      if (state.pis.includes(id)) return;
      state.pis.push(id);
      b.classList.add("found");
      save();
      if (state.pis.length >= PI_TOTAL) {
        addPoints(PI_PTS);
        unlock("pi-hunt");
        setTimeout(congrats, 400);
      } else {
        notify(`π trouvé (${state.pis.length}/${PI_TOTAL})`, PI_PTS, "Chasse au π");
        addPoints(PI_PTS);
      }
    });
  });
  const pc = $("#pi-congrats");
  if (pc) {
    pc.addEventListener("click", (e) => { if (e.target === pc || e.target.closest(".pi-congrats-close")) pc.hidden = true; });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") pc.hidden = true; });
  }

  const fmtWait = (sec) => {
    sec = Math.round(sec || 0);
    return sec < 60 ? `${sec} s` : `${Math.floor(sec / 60)} min ${String(sec % 60).padStart(2, "0")}`;
  };

  /* Filtre π : recadre la photo et la passe dans la charte du site.
     modes : rose, acide, pop, trame. Tout se fait dans le navigateur. */
  function piFilter(img, mode, W, H) {
    const out = document.createElement("canvas"); out.width = W; out.height = H;
    const c = out.getContext("2d", { willReadFrequently: true });
    const r = Math.max(W / img.width, H / img.height);
    const w = img.width * r, h = img.height * r;
    c.drawImage(img, (W - w) / 2, (H - h) / 2.6, w, h);
    const d = c.getImageData(0, 0, W, H), px = d.data;
    const g = new Float32Array(W * H);
    let lo = 255, hi = 0;
    for (let i = 0; i < g.length; i++) {
      const v = 0.299 * px[i * 4] + 0.587 * px[i * 4 + 1] + 0.114 * px[i * 4 + 2];
      g[i] = v; if (v < lo) lo = v; if (v > hi) hi = v;
    }
    const span = Math.max(1, hi - lo);
    for (let i = 0; i < g.length; i++) g[i] = Math.min(1, Math.max(0, ((g[i] - lo) / span - 0.5) * 1.25 + 0.5));
    const hex = (hcol) => [1, 3, 5].map((k) => parseInt(hcol.slice(k, k + 2), 16));
    if (mode === "trame") {
      c.fillStyle = "#f1ede2"; c.fillRect(0, 0, W, H); c.fillStyle = "#0b0b0b";
      const cell = Math.max(6, Math.round(W / 46));
      for (let y = 0; y < H; y += cell) for (let x = 0; x < W; x += cell) {
        const v = g[Math.min(H - 1, y + (cell >> 1)) * W + Math.min(W - 1, x + (cell >> 1))];
        const rad = (1 - v) * cell * 0.72;
        if (rad > 0.4) { c.beginPath(); c.arc(x + cell / 2, y + cell / 2, rad, 0, Math.PI * 2); c.fill(); }
      }
      return out;
    }
    const pal = mode === "pop" ? ["#0b0b0b", "#2d2dff", "#ff3fa4", "#d7ff1e"].map(hex) : null;
    const [a, b] = mode === "acide" ? [hex("#1a1aa8"), hex("#d7ff1e")] : [hex("#0b0b0b"), hex("#ff3fa4")];
    for (let i = 0; i < g.length; i++) {
      const v = g[i]; let col;
      if (pal) col = pal[v < 0.27 ? 0 : v < 0.49 ? 1 : v < 0.73 ? 2 : 3];
      else col = [a[0] + (b[0] - a[0]) * v, a[1] + (b[1] - a[1]) * v, a[2] + (b[2] - a[2]) * v];
      px[i * 4] = col[0]; px[i * 4 + 1] = col[1]; px[i * 4 + 2] = col[2]; px[i * 4 + 3] = 255;
    }
    c.putImageData(d, 0, 0);
    return out;
  }

  let photo = null;
  const photoInput = $("#card-photo");
  const photoPreview = $("#card-photo-preview");
  function refreshPreview() {
    if (!photo) { photoPreview.hidden = true; return; }
    const f = piFilter(photo, $("#card-filter").value, 180, 230);
    photoPreview.hidden = false;
    const pc = $("canvas", photoPreview);
    pc.width = 180; pc.height = 230;
    pc.getContext("2d").drawImage(f, 0, 0);
  }
  if (photoInput) {
    photoInput.addEventListener("change", () => {
      const file = photoInput.files && photoInput.files[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => { photo = img; refreshPreview(); URL.revokeObjectURL(url); };
      img.onerror = () => { $("#card-error").textContent = "Cette image n'est pas alignée (format non reconnu)."; URL.revokeObjectURL(url); };
      img.src = url;
    });
    $("#card-filter").addEventListener("change", refreshPreview);
    $("#card-photo-remove").addEventListener("click", () => { photo = null; photoInput.value = ""; refreshPreview(); });
  }

  /* ---------- Carte de fidélité ---------- */
  const form = $("#card-form");
  const canvas = $("#card-canvas");
  let memberNo = null;

  async function drawCard(data) {
    try {
      await Promise.all(["32px 'Archivo Black'", "italic 32px 'Instrument Serif'", "700 20px 'Space Mono'", "20px 'Space Mono'"].map((f) => document.fonts.load(f)));
    } catch { /* polices de secours */ }
    const W = 1016, H = 640, c = canvas.getContext("2d");
    canvas.width = W; canvas.height = H;
    const t = tierOf(state.points);
    const dark = t.id === "cercle" || t.id === "majuscule";
    // fond + grille
    c.fillStyle = "#f1ede2"; c.fillRect(0, 0, W, H);
    c.strokeStyle = "rgba(11,11,11,.07)"; c.lineWidth = 1;
    for (let x = 0; x < W; x += 28) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, H); c.stroke(); }
    for (let y = 0; y < H; y += 28) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }
    // bandeau rang
    c.fillStyle = t.color; c.fillRect(0, 0, W, 120);
    c.fillStyle = "#0b0b0b"; c.fillRect(0, 120, W, 6);
    c.fillStyle = dark ? "#d7ff1e" : "#0b0b0b";
    c.font = "46px 'Archivo Black', Impact, sans-serif";
    c.fillText("LA BÜTIQUE ARMY", 40, 78);
    c.font = "700 20px 'Space Mono', monospace";
    c.textAlign = "right"; c.fillText("CARTE DE FIDÉLITÉ", W - 40, 56);
    const upKeepPi = (str) => str.split("π").map((x) => x.toUpperCase()).join("π");
    c.fillText(`RANG : ${upKeepPi(t.name)}`, W - 40, 86);
    c.textAlign = "left";
    // nom
    c.fillStyle = "#0b0b0b";
    c.font = "64px 'Archivo Black', Impact, sans-serif";
    const name = (data.name || "Anonyme").slice(0, 22);
    c.fillText(name, 40, 216, 640);
    c.font = "700 20px 'Space Mono', monospace";
    c.fillText(`MEMBRE N° ${memberNo}`, 40, 256);
    // infos
    const rows = [
      ["BÜTIQUE POINTS", `◆ ${num.format(state.points)}`],
      ["TAUX VIBRATOIRE", data.hz],
      ["SUCCÈS", `${Object.keys(state.ach).length}/${Object.keys(ACH).length}`],
      ["π TROUVÉS", `${state.pis.length}/${PI_TOTAL}`],
      ["CO-WAITING", fmtWait(state.waited)],
    ];
    rows.forEach(([k, v], i) => {
      const x = 40 + (i % 3) * 225, y = 320 + Math.floor(i / 3) * 84;
      c.fillStyle = "#0b0b0b"; c.font = "16px 'Space Mono', monospace"; c.fillText(k, x, y, 210);
      c.font = "32px 'Archivo Black', Impact, sans-serif"; c.fillText(v, x, y + 38, 205);
    });
    // mantra
    c.font = "italic 32px 'Instrument Serif', Georgia, serif";
    c.fillText(`« ${(data.mantra || "Je mérite ce que je ne comprends pas").slice(0, 52)} »`, 40, 520, 640);
    c.font = "16px 'Space Mono', monospace";
    c.fillText("Valable jusqu'au 31 növembre · Non cessible · Non comprise", 40, 600);
    // code-barres
    let x = 720;
    for (let i = 0; i < 70; i++) {
      const w = 1 + ((i * 7 + memberNo.length * 3) % 4);
      if (i % 3 !== 1) { c.fillRect(x, 470, w, 110); }
      x += w + 2;
      if (x > W - 40) break;
    }
    c.font = "14px 'Space Mono', monospace"; c.fillText("3 1415 9265 3589", 760, 600);
    // photo filtrée (ou grand sticker π)
    const sticker = (cx, cy, r, size) => {
      c.save(); c.translate(cx, cy); c.rotate(0.2);
      c.fillStyle = "#ff3fa4"; c.strokeStyle = "#0b0b0b"; c.lineWidth = 6;
      c.beginPath(); c.arc(0, 0, r, 0, Math.PI * 2); c.fill(); c.stroke();
      c.fillStyle = "#0b0b0b"; c.font = `italic ${size}px 'Instrument Serif', Georgia, serif`;
      c.textAlign = "center"; c.fillText("π", 0, size * 0.3);
      c.restore();
    };
    if (photo) {
      const pw = 226, ph = 288, f = piFilter(photo, data.filter, pw * 2, ph * 2);
      c.save(); c.translate(856, 296); c.rotate(-0.05);
      c.fillStyle = "#0b0b0b"; c.fillRect(-pw / 2 + 10, -ph / 2 + 10, pw, ph);
      c.drawImage(f, -pw / 2, -ph / 2, pw, ph);
      c.strokeStyle = "#0b0b0b"; c.lineWidth = 6; c.strokeRect(-pw / 2, -ph / 2, pw, ph);
      c.restore();
      sticker(966, 160, 44, 62);
    } else {
      sticker(860, 300, 96, 130);
    }
    // cadre
    c.strokeStyle = "#0b0b0b"; c.lineWidth = 8; c.strokeRect(4, 4, W - 8, H - 8);
  }

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const err = $("#card-error");
      const name = form.elements.name.value.trim();
      if (!name) { err.textContent = "Un prénom est requis. Un nom de scène est apprécié."; form.elements.name.focus(); return; }
      if (!form.elements.pledge.checked) { err.textContent = "Merci de prêter l'Army Pledge. Il n'engage à rien, mais il engage."; return; }
      err.textContent = "";
      memberNo = memberNo || `314-${String(Math.floor(1000 + Math.random() * 8999))}`;
      unlock("card");
      if (photo) unlock("selfie");
      await drawCard({ name, hz: form.elements.hz.value, mantra: form.elements.mantra.value.trim(), filter: form.elements.filter.value });
      $("#card-result").hidden = false;
      $("#card-result").scrollIntoView({ block: "nearest", behavior: still.matches ? "auto" : "smooth" });
    });
    $("#card-download").addEventListener("click", () => {
      canvas.toBlob((blob) => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "carte-butique-army.png";
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      }, "image/png");
    });
    $("#card-print").addEventListener("click", () => {
      let zone = $("#print-zone");
      if (!zone) { zone = document.createElement("div"); zone.id = "print-zone"; document.body.appendChild(zone); }
      zone.innerHTML = `<img alt="Carte de fidélité La Bütique Army" src="${canvas.toDataURL("image/png")}">`;
      document.body.classList.add("printing-card");
      const done = () => { document.body.classList.remove("printing-card"); window.removeEventListener("afterprint", done); };
      window.addEventListener("afterprint", done);
      setTimeout(() => window.print(), 50);
    });
  }

  /* ---------- Co-waiting™ ---------- */
  const cw = $("#cowait");
  if (cw) {
    const posEl = $("#cw-pos"), timeEl = $("#cw-time"), logEl = $("#cw-log"), bar = $("#cw-bar");
    const joinBtn = $("#cw-join"), acts = $("#cw-actions");
    const DURATION = 194, START = 47;
    const EVENTS = [
      ["Un·e Ambassadeur·rice passe devant vous, avec bienveillance.", 1],
      ["π passe devant tout le monde. C'est son droit.", 1],
      ["Un membre du Cercle π vous double. Il vous sourit.", 1],
      ["Quelqu'un devant vous abandonne. Il n'était pas aligné.", -1],
      ["Un influenceur est exfiltré par l'entrée de service.", -1],
      ["La file avance. Vous aussi, intérieurement.", -1],
      ["Distribution d'hydratation consciente (14 €). Personne ne bouge.", 0],
      ["On vous propose de passer en co-waiting premium. Vous déclinez. Vous reculez.", 1],
    ];
    let pos = START, t0 = 0, timer = 0, net = 0, running = false;
    const log = (m) => {
      const li = document.createElement("li"); li.textContent = m;
      logEl.prepend(li);
      while (logEl.children.length > 4) logEl.lastChild.remove();
    };
    const elapsed = () => (Date.now() - t0) / 1000;
    function paint() {
      posEl.textContent = `N°${NB}${pos}`;
      const e = Math.min(DURATION, elapsed());
      timeEl.textContent = fmtWait(e);
      bar.style.width = `${(e / DURATION) * 100}%`;
    }
    function finish() {
      clearInterval(timer); running = false;
      pos = 1; paint();
      state.waited = (state.waited || 0) + DURATION; save();
      log("C'est votre tour ! … La Bütique est fermée (slow-retail). Réouverture : bientôt-toujours.");
      cw.classList.add("done");
      acts.hidden = true;
      joinBtn.hidden = false; joinBtn.textContent = "Recommencer à attendre";
      unlock("cowaiting");
      render();
    }
    function tick() {
      const e = elapsed();
      if (e >= DURATION) return finish();
      const r = Math.random();
      if (r < 0.18) { const [m, d] = EVENTS[Math.floor(Math.random() * EVENTS.length)]; pos += d; log(m); }
      else if (r < 0.78) pos -= 1;
      // jamais n°1 avant 3 min 14, jamais au-delà du départ + 10
      const floor = Math.max(2, Math.round(START * (1 - e / DURATION)) - 4);
      pos = Math.min(START + 10, Math.max(floor, pos));
      paint();
    }
    joinBtn.addEventListener("click", () => {
      pos = START; t0 = Date.now(); net = 0; running = true;
      logEl.innerHTML = ""; cw.classList.remove("done");
      log("Vous rejoignez la file. Bienvenue dans le co-waiting.");
      joinBtn.hidden = true; acts.hidden = false;
      paint(); clearInterval(timer); timer = setInterval(tick, 2000);
    });
    acts.addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b || !running) return;
      const a = b.dataset.cw;
      if (a === "meditate") log("Vous méditez en attendant. La file aussi.");
      if (a === "network") {
        if (net < 5) { net++; addPoints(3); log(`Silent networking réussi (${net}/5) : vous avez regardé quelqu'un sans lui parler. +3 pts.`); }
        else log("Votre réseau silencieux est saturé. Respirez.");
      }
      if (a === "report") { pos = Math.min(START + 10, pos + 3); log("Signalement enregistré. Par souci d'équité, vous reculez de 3 places."); paint(); }
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && running) { pos = Math.min(START + 10, pos + 5); log("Vous vous êtes absenté·e. Le co-waiting exige votre présence : −5 places."); paint(); }
    });
  }

  /* ---------- Code secret : 3,1416 ---------- */
  const DIGITS = "31415926535897932384626433832795028841971693993751";
  let codeTurn = 0;
  function runCode() {
    unlock("code");
    const mode = ["delfine", "pi", "reveal"][codeTurn++ % 3];
    if (mode === "delfine") {
      notify("Mode Del-Fine™ activé (10 s)", 0, "Code 3,1416");
      if (still.matches) return;
      const main = $("main"); let n = 0;
      const jolt = () => {
        if (n++ > 12) { main.style.transform = ""; return; }
        main.style.transform = `rotate(${(Math.random() * 1.6 - .8).toFixed(2)}deg) translate(${Math.round(Math.random() * 14 - 7)}px, ${Math.round(Math.random() * 10 - 5)}px)`;
        setTimeout(jolt, 400 + Math.random() * 1100);
      };
      jolt();
    } else if (mode === "pi") {
      notify("Mode π activé (8 s)", 0, "Code 3,1416");
      const heads = $$(".h2, .hero-lead, .lead");
      const saved = heads.map((h) => h.innerHTML);
      heads.forEach((h, i) => { h.textContent = DIGITS.slice(0, Math.max(6, Math.min(48, h.textContent.length))).replace(/^3/, "3,"); });
      setTimeout(() => heads.forEach((h, i) => (h.innerHTML = saved[i])), 8000);
    } else {
      notify("Révélation imminente", 0, "Code 3,1416");
      document.dispatchEvent(new CustomEvent("bq-reveal"));
    }
  }
  document.addEventListener("bq-code", runCode);
  let typed = "";
  document.addEventListener("keydown", (e) => {
    if (e.target.closest && e.target.closest("input, textarea, select")) return;
    if (!/^[0-9]$/.test(e.key)) return;
    typed = (typed + e.key).slice(-5);
    if (typed === "31416") { typed = ""; runCode(); }
  });
  let taps = [];
  $$(".logo").forEach((l) => l.addEventListener("click", (e) => {
    const now = Date.now();
    taps = taps.filter((t) => now - t < 900); taps.push(now);
    if (taps.length >= 3) { taps = []; e.preventDefault(); runCode(); }
  }));

  /* ---------- Catering : défilé des plats dans l'assiette ---------- */
  const plate = $(".plate");
  if (plate) {
    const dishes = $$(".dish", plate);
    let di = 0, dt = 0, seen = false;
    const show = (i) => {
      dishes[di].classList.remove("active");
      di = (i + dishes.length) % dishes.length;
      dishes[di].classList.add("active");
      $("#plate-name").textContent = dishes[di].dataset.name;
      $("#plate-cap").textContent = dishes[di].dataset.cap;
      $("#plate-num").textContent = `${di + 1}/${dishes.length}`;
    };
    const play = () => { if (!dt && seen && !still.matches && !document.hidden) dt = setInterval(() => show(di + 1), 2800); };
    const stop = () => { clearInterval(dt); dt = 0; };
    plate.addEventListener("click", () => { stop(); show(di + 1); play(); });
    new IntersectionObserver(([en]) => { seen = en.isIntersecting; seen ? play() : stop(); }).observe(plate);
    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : play()));
  }

  /* ---------- Mini-Bütique : conseil parental tapé à la machine ---------- */
  const conseil = $("#conseil");
  if (conseil) {
    const lines = $$(".cs-line", conseil);
    const fill = () => lines.forEach((l) => { l.textContent = l.dataset.text; });
    if (still.matches) fill();
    else {
      let started = false;
      new IntersectionObserver(([en], obs) => {
        if (!en.isIntersecting || started) return;
        started = true; obs.disconnect();
        let li = 0, ci = 0;
        conseil.classList.add("typing");
        const step = () => {
          if (li >= lines.length) { conseil.classList.remove("typing"); conseil.classList.add("typed"); return; }
          const l = lines[li], t = l.dataset.text;
          l.classList.add("cur");
          l.textContent = t.slice(0, ++ci);
          if (ci >= t.length) { l.classList.remove("cur"); li++; ci = 0; setTimeout(step, 420); }
          else setTimeout(step, t[ci - 1] === " " ? 12 : 22);
        };
        step();
      }, { threshold: 0.4 }).observe(conseil);
    }
  }

  /* ---------- Mini-Bütique : fausse urgence ---------- */
  const mt = $("#mini-timer");
  if (mt) {
    let left = 194;
    setInterval(() => {
      left--;
      if (left < 0) { mt.textContent = "offre prolongée"; if (left < -3) left = 194; return; }
      mt.textContent = `${String(Math.floor(left / 60)).padStart(2, "0")}:${String(left % 60).padStart(2, "0")}`;
    }, 1000);
  }

  /* ---------- Bütique Living : dossier et simulateur de mérite ---------- */
  const simR = $("#sim-result");
  if (simR) {
    const PRICE = 101826, sal = $("#sim-salary"), her = $("#sim-heritage");
    let touched = false;
    function sim() {
      const s = Math.max(0, Number(sal.value) || 0), hv = Math.max(0, Number(her.value) || 0);
      if (hv >= PRICE) { simR.innerHTML = `<b>0 an.</b> Félicitations : votre mérite est remarquable. π vous reconnaît comme l'un des siens.`; return; }
      const perYear = s * 12 * 0.1;
      if (!perYear) { simR.innerHTML = `<b>∞ ans.</b> Avez-vous pensé à vous lever plus tôt ?`; return; }
      const y = (PRICE - hv) / perYear;
      simR.innerHTML = `<b>${num.format(Math.ceil(y))} ans</b> de travail acharné, en épargnant 10${NB}% de votre salaire. ` +
        (y > 30 ? "Avez-vous pensé à vous lever plus tôt ?" : "Vous y êtes presque. Enfin, vos parents.") + ` <small>π, lui, a mis 0${NB}an.</small>`;
    }
    [sal, her].forEach((el) => el.addEventListener("input", () => { sim(); if (!touched) { touched = true; unlock("merit"); } }));
    sim();
    $("#liv-apply").addEventListener("click", () => {
      const m = $("#liv-msg");
      m.textContent = "Dossier reçu. Vous êtes 1 400e sur la liste. Votre profil sera évalué selon votre mérite (et celui de vos garants).";
      m.hidden = false;
      unlock("living");
    });
  }

  /* ---------- Catering : devis ---------- */
  const catSum = $("#cat-sum");
  if (catSum) {
    const f = $("#cat-formula"), g = $("#cat-guests");
    const row = (k, v, cls = "") => `<div class="${cls}"><dt>${k}</dt><dd>${v}</dd></div>`;
    function quote() {
      const opt = f.selectedOptions[0], unit = Number(opt.value), grams = Number(opt.dataset.g);
      const n = Math.max(1, Math.min(999, Math.round(Number(g.value) || 1)));
      const base = unit * n, dressage = base * 0.22, contemplation = 15 * n, chef = 314, zen = (base + dressage) * 0.08;
      const total = base + dressage + contemplation + chef + zen;
      catSum.innerHTML = row(`${n} × ${eur.format(unit)}`, eur.format(base))
        + row("Frais de dressage (22 %)", eur.format(dressage))
        + row("Frais de contemplation", eur.format(contemplation))
        + row("Déplacement du chef (en trottinette)", eur.format(chef))
        + row("Taxe zen (8 %)", eur.format(zen))
        + row("Total", eur.format(total), "total")
        + row("Quantité servie", `${grams}${NB}g par personne, soit ${eur.format(total / (grams * n) * 1000)} le kilo`, "kilo");
    }
    f.addEventListener("change", quote); g.addEventListener("input", quote); quote();
    const CAT_MSGS = [
      "Devis en cours de dressage. Il vous sera présenté sur une ardoise, à la pince.",
      "Le chef a bien reçu votre demande. Il la laisse reposer 72 heures, comme un levain.",
      "Votre réception est confirmée sous réserve de disponibilité de notre cuisine centrale partenaire.",
    ];
    let ci = 0;
    $("#cat-order").addEventListener("click", () => notify(CAT_MSGS[ci++ % CAT_MSGS.length], 0, "Bütique Catering"));
  }

  /* ---------- Bücoin ---------- */
  const priceEl = $("#bu-price");
  if (priceEl) {
    let price = 314.15, open = price, hz = 432;
    const hist = Array.from({ length: 40 }, (_, i) => price + Math.sin(i / 3) * 6);
    const line = $("#bu-line"), chg = $("#bu-change"), hzEl = $("#bu-hz");
    function tick() {
      price = Math.max(3.14, price * (1 + (Math.random() - 0.47) * 0.06));
      hist.push(price); hist.shift();
      const min = Math.min(...hist), max = Math.max(...hist);
      line.setAttribute("points", hist.map((v, i) => `${(i / (hist.length - 1)) * 300},${90 - ((v - min) / (max - min || 1)) * 80}`).join(" "));
      priceEl.textContent = eur.format(price);
      const pct = ((price - open) / open) * 100;
      chg.textContent = `${pct >= 0 ? "▲ +" : "▼ "}${pct.toFixed(2).replace(".", ",")} % depuis l'ouverture de cette page`;
      chg.classList.toggle("down", pct < 0);
      hz = Math.round(Math.max(144, Math.min(963, hz + (Math.random() - 0.5) * 40)));
      hzEl.textContent = `${hz} Hz`;
      conv();
    }
    const amount = $("#bu-amount"), outEl = $("#bu-out");
    function conv() {
      const v = Math.max(0, Number(amount.value) || 0);
      const net = v * 0.67;
      outEl.textContent = `${(net / price).toFixed(4).replace(".", ",")}${NB}₿ü (après frais vibratoires de 33${NB}%)`;
    }
    amount.addEventListener("input", conv);
    tick();
    let timer = setInterval(tick, 1600);
    document.addEventListener("visibilitychange", () => { clearInterval(timer); if (!document.hidden) timer = setInterval(tick, 1600); });
    $("#bu-buy").addEventListener("click", () => {
      unlock("bucoin");
      const m = $("#bu-msg");
      m.textContent = "Ordre transmis. Vos ₿ü seront crédités dès que votre taux vibratoire atteindra 963 Hz. En attendant, vous êtes sur liste d'attente.";
      m.hidden = false;
    });
  }

  /* ---------- NFT « Accords Bütiques » ---------- */
  $$(".nft").forEach((card) => {
    const id = card.dataset.nft, btn = $(".nft-mint", card);
    const mark = () => { card.classList.add("minted"); btn.textContent = "Minté ✓ (dans l'intention)"; btn.disabled = true; };
    if (state.minted.includes(id)) mark();
    btn.addEventListener("click", () => {
      if (!state.minted.includes(id)) { state.minted.push(id); save(); }
      mark();
      if (state.ach.nft) notify("NFT minté · exemplaire unique n°1/500", 0, "Blockchain Bücoin");
      else unlock("nft");
    });
  });

  /* ---------- Méditation ---------- */
  const medBtn = $("#med-start");
  if (medBtn) {
    const STEPS = [
      "Installez-vous confortablement. Ou pas : la posture est incluse dans le prix.",
      "Inspirez… la marque.",
      "Expirez… votre panier.",
      "Visualisez la Del-Fine™. Ne cherchez pas à savoir ce que c'est.",
      "Sentez votre taux vibratoire s'élever. +12 Hz.",
      "Accueillez vos pensées. Puis facturez-les.",
      "Inspirez l'air de là-bas, acheminé par avion.",
      "Expirez vos attentes. Elles vous seront rendues à la sortie (4 €).",
      "Répétez intérieurement votre mantra d'achat.",
      "Revenez doucement. Votre séance vous a été facturée 14 €.",
    ];
    const txt = $("#med-text"), bubble = $(".med-bubble"), time = $("#med-time"), hzOut = $("#med-hz");
    let i = 0, timer = 0, left = 0, running = false;
    function stop(finished) {
      clearInterval(timer); running = false;
      bubble.classList.remove("breathing");
      medBtn.textContent = finished ? "Recommencer (re-facturé)" : "Reprendre la séance";
      if (finished) {
        unlock("meditation");
        hzOut.textContent = "Taux vibratoire : +108 Hz (certifié par π)";
      }
    }
    medBtn.addEventListener("click", () => {
      if (running) { stop(false); txt.textContent = "Séance interrompue. Le temps non médité reste facturé."; return; }
      if (left <= 0) { i = 0; left = 60; }
      running = true;
      medBtn.textContent = "Interrompre (non remboursé)";
      if (!still.matches) bubble.classList.add("breathing");
      txt.textContent = STEPS[i];
      time.textContent = `${left}${NB}s`;
      timer = setInterval(() => {
        left--;
        time.textContent = `${left}${NB}s`;
        if (left % 6 === 0 && i < STEPS.length - 1) { i++; txt.textContent = STEPS[i]; }
        if (left <= 0) stop(true);
      }, 1000);
    });
  }

  render();
})();
