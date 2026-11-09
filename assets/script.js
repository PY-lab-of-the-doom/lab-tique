/* ==========================================================
   LA BÜTIQUE — Interactions alignées
   ========================================================== */
(() => {
  "use strict";

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const eur = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 2 });
  const num = new Intl.NumberFormat("fr-FR");

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* slow-storage */ } },
  };

  /* ---------- Toast ---------- */
  const toastEl = $("#toast");
  let toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 4200);
  }

  /* ---------- Hero : lettres désalignées ---------- */
  const mega = $("[data-split]");
  if (mega) {
    const styles = ["", "", "", "serif", "outline", "pink", "blue", "mono"];
    const text = mega.textContent.trim();
    mega.textContent = "";
    text.split(" ").forEach((w, wi) => {
      if (wi) {
        const sp = document.createElement("span");
        sp.className = "space";
        sp.setAttribute("aria-hidden", "true");
        mega.appendChild(sp);
      }
      const word = document.createElement("span");
      word.className = "word";
      word.setAttribute("aria-hidden", "true");
      [...w].forEach((c) => {
        const s = document.createElement("span");
        s.className = "ch " + pick(styles);
        s.textContent = c;
        s.style.transform = `rotate(${(Math.random() * 12 - 6).toFixed(1)}deg) translateY(${(Math.random() * 0.1 - 0.05).toFixed(3)}em)`;
        word.appendChild(s);
      });
      mega.appendChild(word);
    });
  }

  /* ---------- Verrou de défilement (menu, panier) ---------- */
  const locks = new Set();
  function lock(key, on) {
    if (on) locks.add(key); else locks.delete(key);
    document.body.classList.toggle("locked", locks.size > 0);
  }

  /* ---------- Menu mobile ---------- */
  const menu = $("#menu");
  const menuBtn = $("#menu-open");
  function openMenu() {
    menu.hidden = false;
    menuBtn.setAttribute("aria-expanded", "true");
    lock("menu", true);
    $("#menu-close").focus();
  }
  function closeMenu(restoreFocus = true) {
    if (menu.hidden) return;
    menu.hidden = true;
    menuBtn.setAttribute("aria-expanded", "false");
    lock("menu", false);
    if (restoreFocus) menuBtn.focus();
  }
  menuBtn.addEventListener("click", openMenu);
  $("#menu-close").addEventListener("click", () => closeMenu());
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) closeMenu(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });
  window.matchMedia("(min-width: 901px)").addEventListener("change", (e) => { if (e.matches) closeMenu(false); });

  /* ---------- Marquee : boucle infinie ---------- */
  const marquee = $("#marquee");
  if (marquee) marquee.innerHTML += marquee.innerHTML;

  /* ---------- Live counter ---------- */
  let waitlistCount = 4812;
  const liveWait = $("#live-waitlist");
  const liveInside = $("#live-inside");
  setInterval(() => {
    waitlistCount += Math.floor(Math.random() * 3);
    liveWait.textContent = num.format(waitlistCount);
    liveInside.textContent = pick([2, 3, 3, 3, 4, 0, 1]);
  }, 2600);

  /* ---------- Cookies ---------- */
  const cookie = $("#cookie");
  if (!store.get("butique-cookies")) setTimeout(() => { cookie.hidden = false; }, 700);
  const cookieMsgs = {
    all: "Merci. Vos cookies ont été accueillis.",
    conscious: "Consentement éclairé enregistré. Bienvenue dans la communauté.",
    save: "Préférences enregistrées. Elles seront respectées dans la mesure du ressenti.",
    refuse: "Refus enregistré. Vous avez été placé·e sur la liste d'attente des refus (position 2 207).",
  };
  cookie.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-cookie]");
    if (!btn) return;
    const kind = btn.dataset.cookie;
    if (kind === "custom") {
      const prefs = $("#cookie-prefs");
      prefs.hidden = false;
      btn.textContent = "Valider mes non-choix";
      btn.dataset.cookie = "save";
      return;
    }
    cookie.hidden = true;
    store.set("butique-cookies", kind);
    toast(cookieMsgs[kind]);
  });

  /* ---------- Collection ---------- */
  const CATS = {
    tout: "Tout (relatif)",
    ressentis: "Ressentis",
    matieres: "Matières à penser",
    intentions: "Intentiöns",
    objets: "Objets (?)",
    comestibles: "Comestibles (a priori)",
    neuro: "Neurö-inclusif",
  };

  const VISUALS = {
    blob: { cls: "v-blob", cap: "Visuel d'ambiance" },
    none: { cls: "v-none", inner: "<span>Visuel retiré pour préserver le mystère</span>" },
    hand: { cls: "v-hand", inner: "<span>✋</span>", cap: "Détail" },
    bowl: { cls: "v-bowl", inner: "<span></span>", cap: "Vue de profil (supposée)" },
    fabric: { cls: "v-fabric", cap: "Gros plan" },
    question: { cls: "v-question", inner: "<span>?</span>" },
    pi: { cls: "v-pi", inner: "<span>π</span>", cap: "Avec π" },
    grain: { cls: "v-grain", cap: "Mise au point volontairement libre" },
    lines: { cls: "v-lines", cap: "Plan technique" },
    water: { cls: "v-water", cap: "Suggestion de présentation" },
    slogan: { cls: "v-slogan", inner: "<span>EMPOW<br>ERMENT</span>", cap: "Message fort" },
  };

  const PRODUCTS = [
    { id: "e07", name: "Ëntité n°07", cat: "ressentis", v: "blob", price: 340, desc: "Disponible selon l'énergie du lieu.", meta: "Édition limitée à 1 (ou plus)" },
    { id: "bol", name: "Le Bol (pre-loved)", cat: "objets", v: "bowl", price: 89, desc: "Contenant ou contenu, selon votre lecture. Sourcé par π lors d'une session de deep-chinage.", meta: "Seconde main · troisième vie" },
    { id: "h2o", name: "Hydratatiön Cönsciente", cat: "comestibles", v: "water", price: 14, desc: "Servie en glass-to-glass. Non désaltérante par principe : la soif est une information.", meta: "33 cl ressentis" },
    { id: "share", name: "Pass Share-Care", cat: "intentions", v: "hand", price: 120, unit: "/ mois", desc: "Vous prêtez quelque chose à quelqu'un. Nous sécurisons le flux.", meta: "Sans engagement (engagement moral requis)" },
    { id: "sil", name: "Silence — Live at La Bütique", cat: "ressentis", v: "none", price: 45, desc: "Captation intégrale de notre dernier concert. Format : aucun. Durée : la vôtre.", meta: "Pressage limité" },
    { id: "m3", name: "Matière n°3", cat: "matieres", v: "fabric", price: 560, desc: "Texture. Origine : quelque part entre ici et ailleurs. Usage à co-définir en boutique.", meta: "Vendue au mètre (ou à l'heure)" },
    { id: "lev", name: "Levain d'Intentiön", cat: "comestibles", v: "grain", price: 28, desc: "Fermentation 72 jours. Servi en visualisation guidée. Croûte en option.", meta: "Zéro-cuisine · zéro-miette" },
    { id: "tote", name: "Tote Bag Upcyclé", cat: "objets", v: "question", price: 210, desc: "Upcyclé à partir d'un autre tote bag. Peut contenir. Ne contient pas.", meta: "Pièce unique, en série" },
    { id: "soro", name: "Tote « Sororité »", cat: "intentions", v: "slogan", price: 290, desc: "Coton bio, slogan engagé. 1 % reversé à notre propre campagne de sensibilisation.", meta: "Taxe rose responsable incluse" },
    { id: "rb", name: "Rëbranding Persönnel", cat: "intentions", v: "pi", price: 1900, desc: "Vous entrez. Vous ressortez. Vous êtes la même personne, avec une meilleure typographie.", meta: "Séance de 3 h 14 avec π" },
    { id: "seat", name: "Assise Partagée", cat: "objets", v: "lines", price: 75, unit: "/ session", desc: "Micro-ownership : non emportable, pleinement habitable pendant 7 minutes.", meta: "Réservation conseillée" },
    { id: "x", name: "Sans titre", cat: "matieres", v: "none", price: 3140, desc: "—", meta: "Réservé au Cercle π", members: true },
    { id: "delfine", name: "Del-Fine™", cat: "neuro", price: 1618, featured: true },
    { id: "drop", name: "Mystery Drop", cat: "ressentis", v: "question", price: null, desc: "Sa nature sera révélée au moment précis où il ne sera plus disponible.", meta: "Épuisé avant la mise en ligne", soldout: true },
  ];

  const filtersEl = $("#filters");
  const productsEl = $("#products");

  Object.entries(CATS).forEach(([key, label], i) => {
    const b = document.createElement("button");
    b.className = "chip";
    b.type = "button";
    b.dataset.cat = key;
    b.textContent = label;
    b.setAttribute("aria-pressed", i === 0 ? "true" : "false");
    filtersEl.appendChild(b);
  });

  function renderProducts(cat = "tout") {
    const list = PRODUCTS.filter((p) => !p.featured && (cat === "tout" || p.cat === cat));
    $("#delfine").hidden = !(cat === "tout" || cat === "neuro");
    productsEl.innerHTML = list.map((p) => {
      const v = VISUALS[p.v];
      const price = p.price == null ? "—" : eur.format(p.price);
      let btn = `<button class="btn btn-sm btn-acid" data-add="${p.id}">Accueillir</button>`;
      if (p.soldout) btn = `<button class="btn btn-sm" disabled>Épuisé</button>`;
      if (p.members) btn = `<button class="btn btn-sm btn-pink" data-members="${p.id}">Cercle π</button>`;
      return `
        <article class="product">
          <div class="product-img ${v.cls}">${v.inner || ""}${v.cap ? `<span class="cap">${v.cap}</span>` : ""}</div>
          <div class="product-body">
            <span class="product-cat">${CATS[p.cat]}</span>
            <h3>${p.name}</h3>
            <p>${p.desc}</p>
            <span class="product-meta">${p.meta}</span>
            <div class="product-foot">
              <span class="price">${price}${p.unit ? ` <small>${p.unit}</small>` : ""}</span>
              ${btn}
            </div>
          </div>
        </article>`;
    }).join("");
  }
  renderProducts();

  filtersEl.addEventListener("click", (e) => {
    const b = e.target.closest(".chip");
    if (!b) return;
    $$(".chip", filtersEl).forEach((c) => c.setAttribute("aria-pressed", String(c === b)));
    renderProducts(b.dataset.cat);
  });

  /* ---------- Del-Fine : info-dump repliable (mobile) ---------- */
  const dfToggle = $(".delfine-toggle");
  dfToggle.addEventListener("click", () => {
    const open = $("#delfine").classList.toggle("expanded");
    dfToggle.setAttribute("aria-expanded", String(open));
    dfToggle.textContent = open ? "Refermer l'info-dump ↑" : "Lire l'info-dump (314 pages) ↓";
    if (!open) $("#delfine").scrollIntoView({ block: "start" });
  });

  /* ---------- Panier ---------- */
  const cart = new Map(); // id -> qty
  const cartEl = $("#cart");
  const scrim = $("#scrim");
  const cartCount = $("#cart-count");
  const cartItems = $("#cart-items");
  const cartSum = $("#cart-sum");
  const refusal = $("#cart-refusal");
  const checkout = $("#checkout");
  const cartBtn = $("#cart-open");

  const ADD_MSGS = [
    "Accueilli dans votre panier.",
    "Ajouté. Prenez le temps de le ressentir.",
    "Ajouté au panier, sous réserve d'alignement.",
    "Votre panier s'enrichit. Vous aussi.",
  ];

  const REFUSALS = [
    "Votre énergie n'est pas alignée avec ce panier. Nous vous invitons à revenir après une marche consciente.",
    "Paiement refusé : votre panier manque d'intention.",
    "Le checkout pratique actuellement le slow-retail. Réouverture : bientôt-toujours.",
    "Cette commande a déjà été pré-ressentie par un membre du Cercle π.",
    "Merci de rejoindre d'abord la liste d'attente pour accéder au paiement.",
    "Votre carte a été acceptée. Votre démarche, pas encore.",
    "Transaction suspendue. π vous retourne la question : pourquoi voulez-vous posséder ?",
    "Votre panier dépasse le seuil de sobriété autorisé pour une première visite.",
  ];
  let attempts = 0;
  let lastRefusal = -1;

  function openCart() {
    cartEl.classList.add("open");
    cartEl.setAttribute("aria-hidden", "false");
    scrim.hidden = false;
    lock("cart", true);
    $("#cart-close").focus();
  }
  function closeCart() {
    cartEl.classList.remove("open");
    cartEl.setAttribute("aria-hidden", "true");
    scrim.hidden = true;
    lock("cart", false);
    cartBtn.focus();
  }
  cartBtn.addEventListener("click", openCart);
  $("#cart-close").addEventListener("click", closeCart);
  scrim.addEventListener("click", closeCart);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && cartEl.classList.contains("open")) closeCart(); });

  function renderCart() {
    let count = 0;
    let subtotal = 0;
    const rows = [];
    cart.forEach((qty, id) => {
      const p = PRODUCTS.find((x) => x.id === id);
      count += qty;
      subtotal += p.price * qty;
      rows.push(`<li>
        <div><div class="ci-name">${p.name}</div><div>${qty} × ${eur.format(p.price)}</div></div>
        <button class="ci-remove" data-remove="${id}">Libérer</button>
      </li>`);
    });
    cartCount.textContent = count;
    refusal.hidden = true;

    if (!count) {
      cartItems.innerHTML = `<li class="cart-empty" style="border:none;background:none">Votre panier est vide. Le vide est notre best-seller.</li>`;
      cartSum.innerHTML = "";
      checkout.disabled = true;
      return;
    }
    checkout.disabled = false;
    cartItems.innerHTML = rows.join("");

    const curation = subtotal * 0.18;
    const shareCare = 4.5;
    const eco = subtotal * 0.02;
    const total = subtotal + curation + shareCare + eco;
    cartSum.innerHTML = `
      <div class="row"><span>Sous-total</span><span>${eur.format(subtotal)}</span></div>
      <div class="row"><span>Frais de curation (18 %)</span><span>${eur.format(curation)}</span></div>
      <div class="row"><span>Contribution share-care</span><span>${eur.format(shareCare)}</span></div>
      <div class="row"><span>Éco-participation émotionnelle (2 %)</span><span>${eur.format(eco)}</span></div>
      <div class="row"><span>Remise fidélité</span><span>−${eur.format(0)}</span></div>
      <div class="row total"><span>Total</span><span>${eur.format(total)}</span></div>`;
  }
  renderCart();

  $("#shop").addEventListener("click", (e) => {
    const add = e.target.closest("[data-add]");
    if (add) {
      const id = add.dataset.add;
      cart.set(id, (cart.get(id) || 0) + 1);
      renderCart();
      cartBtn.classList.remove("bump");
      void cartBtn.offsetWidth;
      cartBtn.classList.add("bump");
      toast(id === "delfine"
        ? "La Del-Fine™ a rejoint votre panier. Elle a besoin d'un temps d'adaptation."
        : pick(ADD_MSGS));
      return;
    }
    if (e.target.closest("[data-members]")) {
      toast("Pièce réservée aux membres du Cercle π. L'adhésion au Cercle π est sur liste d'attente.");
    }
  });

  cartItems.addEventListener("click", (e) => {
    const r = e.target.closest("[data-remove]");
    if (!r) return;
    const id = r.dataset.remove;
    const q = cart.get(id) - 1;
    if (q > 0) cart.set(id, q); else cart.delete(id);
    renderCart();
    toast("Objet libéré. Il vous remercie.");
  });

  checkout.addEventListener("click", () => {
    attempts++;
    let i;
    do { i = Math.floor(Math.random() * REFUSALS.length); } while (i === lastRefusal);
    lastRefusal = i;
    let msg = REFUSALS[i];
    if (attempts >= 3) msg += " Votre persévérance a été transmise à π pour accompagnement.";
    refusal.textContent = msg;
    refusal.hidden = false;
    cartEl.classList.remove("shake");
    void cartEl.offsetWidth;
    cartEl.classList.add("shake");
  });

  /* ---------- Agenda ---------- */
  const EVENTS = [
    { d: "31 NÖV", s: "Mardi · 19 h", t: "Soirée d'ouverture (fermée)", p: "Inauguration réservée aux personnes de la liste d'attente retenues sur la liste d'attente.", price: "Gratuit — prévente 60 €", st: "full" },
    { d: "01 DÉC", s: "Mercredi · 18 h – minuit", t: "Concert de silence", p: "Six heures de silence live, interprété sans instrument par un collectif berlinois. Rappel prévu.", price: "45 €", st: "wait" },
    { d: "03 DÉC", s: "Vendredi · 20 h", t: "Dégustation d'air", p: "Trois millésimes d'air du Haut-Marais (2019, 2022, ce matin). Accords mets-air par notre sommelier du vide.", price: "38 €" },
    { d: "07 DÉC", s: "Mardi · 11 h", t: "Brunch à jeun", p: "Un brunch slow-food où rien n'est servi, pour réapprendre l'attente. Mimosa en option conceptuelle.", price: "52 €" },
    { d: "12 DÉC", s: "Dimanche · 17 h", t: "Vernissage d'un mur blanc", p: "Œuvre pre-loved : ce mur était déjà là. Nous l'avons simplement regardé autrement.", price: "Entrée libre — 25 €" },
    { d: "14 DÉC", s: "Mardi · 9 h 00 – 12 h 14", t: "Atelier maïeutique avec π", p: "En 3 h 14, π vous accompagne dans l'accouchement de votre propre concept-store. Péridurale non incluse.", price: "314 €", st: "full" },
    { d: "21 DÉC", s: "Mardi · 18 h", t: "Vente privée publique", p: "Ouverte à toutes et à tous, en toute intimité.", price: "15 €" },
    { d: "24 DÉC", s: "Vendredi · 14 h – 16 h", t: "Nocturne", p: "Une nocturne en plein jour, pour celles et ceux qui ne sortent pas le soir.", price: "20 €" },
    { d: "30 FÉV", s: "Jeudi · toute la journée", t: "Pop-up dans le pop-up", p: "Une boutique éphémère à l'intérieur de notre boutique éphémère-sédentaire, pour une durée encore plus limitée.", price: "90 €", st: "cancel" },
    { d: "08 MARS", s: "Mercredi · 8 h 08", t: "Brunch Empowerment", p: "Un brunch réservé aux femmes dirigeantes, ouvert par une keynote de π, qui prendra la parole en premier pour ne pas influencer les échanges.", price: "88 € (après remise de 8 %)", st: "full" },
    { d: "JEUDIS", s: "Hebdomadaire · 19 h", t: "Swap de ressentis", p: "Apportez une émotion dont vous ne vous servez plus. Repartez avec celle de quelqu'un d'autre. Néo-troc 100 % circulaire.", price: "12 €" },
    { d: "DIMANCHES", s: "Square voisin · 12 h 30", t: "Food-sharing nomade", p: "Chacun apporte son repas et le consomme assis sur l'herbe, en communauté. Couverture pre-loved fournie (caution 40 €).", price: "18 €", st: "wait" },
  ];
  const STATUS = {
    full: { cls: "status-full", label: "Complet", btn: "Rejoindre l'attente" },
    wait: { cls: "status-wait", label: "Liste d'attente", btn: "S'inscrire" },
    cancel: { cls: "status-cancel", label: "Annulé (succès)", btn: "Réserver quand même" },
  };
  const BOOK_MSGS = [
    "La liste d'attente de cet événement est actuellement sur liste d'attente.",
    "Réservation enregistrée dans notre intention. Aucune confirmation n'est prévue.",
    "Cet événement affiche complet par anticipation.",
    "Merci. Présentez-vous 45 minutes à l'avance pour votre co-waiting.",
    "Votre place a été attribuée à une personne plus alignée. Nous vous en remercions.",
  ];

  $("#events").innerHTML = EVENTS.map((ev, i) => {
    const st = STATUS[ev.st];
    return `<li class="event">
      <div class="event-date">${ev.d}<small>${ev.s}</small></div>
      <div><h3>${ev.t}</h3><p>${ev.p}</p></div>
      <div class="event-side">
        ${st ? `<span class="status ${st.cls}">${st.label}</span>` : ""}
        <span class="event-price">${ev.price}</span>
        <button class="btn btn-sm" data-book="${i}">${st ? st.btn : "Réserver"}</button>
      </div>
    </li>`;
  }).join("");

  $("#events").addEventListener("click", (e) => {
    if (e.target.closest("[data-book]")) toast(pick(BOOK_MSGS));
  });

  /* ---------- Liste d'attente ---------- */
  const form = $("#waitlist");
  const budget = $("#wl-budget");
  const budgetOut = $("#wl-budget-out");
  function budgetLabel(v) {
    if (v < 300) return "Engagement à retravailler";
    if (v < 1500) return "Alignement correct";
    if (v < 4000) return "Profil prometteur";
    return "Profil Cercle π";
  }
  const updateBudget = () => {
    const v = Number(budget.value);
    budgetOut.textContent = `${eur.format(v)} — ${budgetLabel(v)}`;
  };
  budget.addEventListener("input", updateBudget);
  updateBudget();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const err = $("#wl-error");
    const name = form.elements.name.value.trim();
    const mail = form.elements.mail.value.trim();
    if (!name) { err.textContent = "Un prénom est requis. Un nom de scène est apprécié."; form.elements.name.focus(); return; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(mail)) { err.textContent = "Cette adresse e-mail ne semble pas alignée."; form.elements.mail.focus(); return; }
    if (!form.elements.certify.checked) { err.textContent = "Merci de certifier ne pas savoir ce que vous venez chercher."; return; }
    if (Number(budget.value) === 0) { err.textContent = "Un budget de 0 € traduit une intention encore en gestation. Merci d'ajuster."; budget.focus(); return; }
    err.textContent = "";

    waitlistCount++;
    let pos = waitlistCount;
    const result = $("#wl-result");
    const posEl = $("#wl-pos");
    $("#wl-who").textContent = name;
    posEl.textContent = num.format(pos);
    form.hidden = true;
    result.hidden = false;
    result.focus();
    toast(form.elements.pi.checked ? "Candidature transmise. π vous recontactera (ou non)." : "Candidature transmise à l'algorithme.");

    // La position évolue en temps réel, selon l'alignement.
    setInterval(() => {
      pos += Math.floor(Math.random() * 4) + 1;
      posEl.textContent = num.format(pos);
    }, 3000);
  });
})();
