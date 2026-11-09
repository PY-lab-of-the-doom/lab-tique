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
  let state = { points: 0, ach: {}, pis: [], minted: [] };
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
    ];
    rows.forEach(([k, v], i) => {
      const x = 40 + (i % 2) * 330, y = 320 + Math.floor(i / 2) * 84;
      c.fillStyle = "#0b0b0b"; c.font = "18px 'Space Mono', monospace"; c.fillText(k, x, y);
      c.font = "34px 'Archivo Black', Impact, sans-serif"; c.fillText(v, x, y + 40, 300);
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
    // sticker π
    c.save(); c.translate(860, 300); c.rotate(0.2);
    c.fillStyle = "#ff3fa4"; c.strokeStyle = "#0b0b0b"; c.lineWidth = 6;
    c.beginPath(); c.arc(0, 0, 96, 0, Math.PI * 2); c.fill(); c.stroke();
    c.fillStyle = "#0b0b0b"; c.font = "italic 130px 'Instrument Serif', Georgia, serif";
    c.textAlign = "center"; c.fillText("π", 0, 40);
    c.restore();
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
      await drawCard({ name, hz: form.elements.hz.value, mantra: form.elements.mantra.value.trim() });
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
