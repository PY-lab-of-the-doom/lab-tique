/* ==========================================================
   LA BÜTIQUE — Bütler™, Brand Experience Companion
   Chatbot 100 % scripté (Intelligence Approximative).
   ========================================================== */
(() => {
  "use strict";

  const NB = " ";
  const fix = (t) => t.replace(/« /g, "«" + NB).replace(/ »/g, NB + "»").replace(/ ([?!:;])/g, NB + "$1");

  /* ---------- Répliques ---------- */
  const R = {
    greet: [
      "Bonjour et bienvenue dans l'expérience. Je suis Bütler™, votre Brand Experience Companion. Comment puis-je accompagner votre intention aujourd'hui ?",
      "Hello ! Ravi de matcher avec vous. Quel est votre mood d'achat du jour ?",
      "Coucou. Je suis là pour vous, dans une démarche d'écoute active non contractuelle.",
    ],
    what: [
      "Excellente question. La Bütique ne vend pas des produits : elle active des possibles. Plus concrètement, c'est moins concret.",
      "C'est difficile à résumer en un message. Disons un objet-service-ressenti, à mi-chemin entre ce que vous cherchez et ce que vous ne cherchiez pas.",
      "Je pourrais vous le dire, mais cela casserait la magie du parcours client. Nous préférons que vous le découvriez après paiement.",
      "C'est un concept. Enfin, un méta-concept. Je vous renvoie vers notre manifeste, qui ne le dit pas non plus.",
    ],
    price: [
      "Nos prix sont fixés par un algorithme émotionnel. Si vous demandez le prix, c'est déjà un peu cher pour vous.",
      "Tout dépend de votre niveau d'alignement. À titre indicatif : entre 14 € et l'infini, frais de curation non inclus.",
      "Chez La Bütique, on ne parle pas de prix mais de contribution à l'expérience. La vôtre est estimée à « significative ».",
    ],
    buy: [
      "Bonne nouvelle : vous pouvez accueillir un produit dans votre panier. Moins bonne nouvelle : le paiement pratique actuellement le slow-retail.",
      "Pour acheter, rien de plus simple : rejoignez la liste d'attente, attendez, puis rejoignez la liste d'attente principale.",
      "Je note une forte intention d'achat. Je la transmets à notre pôle Intentions, qui la challengera sous 3 à 14 jours ouvrés.",
    ],
    delivery: [
      "Nous livrons en click & walk : vous venez, vous repartez. Délai estimé : le temps du trajet, plus le co-waiting.",
      "La livraison à domicile est possible, à condition que votre domicile soit La Bütique.",
      "Nos colis sont acheminés par un coursier à pied conscient. Il arrive quand il se sent prêt.",
    ],
    refund: [
      "Les retours sont acceptés sous 14 jours, sous forme de ressenti. Les remboursements, eux, sont versés en intention.",
      "Un remboursement serait un retour en arrière. Chez nous, on ne recule pas : on pivote.",
      "Je comprends votre frustration. Je l'ai ajoutée à votre panier.",
    ],
    delfine: [
      "La Del-Fine™ est notre best-seller neuro-inclusif. Je ne peux pas vous dire ce que c'est, mais elle est disponible sur tout le spectre.",
      "Excellent choix. La Del-Fine™ est hyperfocus-ready : une fois achetée, vous ne penserez plus qu'à elle. Et à ce qu'elle est.",
      "La Del-Fine™ a été conçue par et pour les neuroatypiques, c'est-à-dire par π, qui s'est reconnu dans un carrousel.",
    ],
    pi: [
      "π est actuellement en séance de maïeutique. Il vous retourne la question : qui est π, pour vous ?",
      "π est notre fondateur, coach, conférencier et ancien expert dans l'administration. Il vous recevra dès qu'un créneau se libère. Aucun ne se libère.",
      "π ne répond jamais directement. C'est pour cela qu'il m'a créé : pour ne pas répondre à sa place.",
    ],
    human: [
      "Je vous transfère vers un conseiller humain… Le conseiller humain est π. π est en séance. Je reprends la main.",
      "Vous êtes actuellement n° 314 dans la file d'attente de notre service client. Temps d'attente estimé : éphémère-sédentaire.",
      "Un humain ? Nous avons mieux : une présence augmentée. C'est moi.",
    ],
    contact: [
      "π ne répond pas directement, mais il a un Linktree : un lien qui mène à des liens. C'est très aligné.",
      "Pour joindre π, passez par son Linktree. Il vous répondra quand la question sera mûre.",
    ],
    hours: [
      "Nous sommes ouverts du mardi au samedi, en dehors des heures d'ouverture.",
      "Nos horaires sont slow : nous ouvrons quand l'intention est là. Elle n'est pas encore là.",
    ],
    address: [
      "Haut-Marais, Paris 3e. L'adresse exacte vous sera communiquée oralement, à l'issue de votre co-waiting.",
      "Nous sommes là où vous ne nous attendez pas. Concrètement : derrière la porte de côté. L'autre.",
    ],
    waitlist: [
      "La liste d'attente est ouverte (complète). Je peux vous inscrire sur la liste d'attente de la liste d'attente.",
      "Votre position est actuellement estimée à 4 813. Elle évolue en temps réel, rarement dans le bon sens.",
    ],
    green: [
      "Notre impact est 100 % positif, là-bas. Où ça ? Là-bas. Nous ne le nommons pas, par respect.",
      "Cette conversation est neutre en carbone : chaque message est compensé par la pensée d'un arbre.",
    ],
    fem: [
      "Le féminisme est une valeur forte chez nous. Et une ligne de produits. Puis-je vous proposer le tote « Sororité » à 290 € ?",
      "Notre comité de direction est strictement paritaire : il est composé de π.",
    ],
    corporate: [
      "Je vous recommande le π-Day : un escape-storming dont on ne sort qu'avec un livrable. Gros boost d'employabilité, scope à définir.",
      "Nous ne recrutons pas, nous accueillons des talents. Le poste de stagiaire Head of Vibe est ouvert : non rémunéré, mais nourri d'intentions.",
      "Votre question est hors scope. Je la mets dans le parking lot et on se fait un point asap.",
    ],
    thanks: [
      "C'est moi qui vous remercie. Enfin, c'est π, à travers moi.",
      "Avec plaisir. Votre gratitude a été enregistrée et sera valorisée dans notre rapport d'impact.",
    ],
    bye: [
      "À bientôt. Ou à jamais. Les deux sont éphémère-sédentaires.",
      "Merci pour ce moment de co-création. Votre session a été archivée en tant que ressenti.",
    ],
    fallback: [
      "Votre question est très inspirante. Je la reformule en intention et je reviens vers vous.",
      "Je n'ai pas compris, ce qui est plutôt bon signe : chez nous, comprendre est déconseillé.",
      "Intéressant. Pouvez-vous reformuler en franglais, pour que je puisse mieux matcher votre need ?",
      "Je suis une IA artisanale (Intelligence Approximative). Je réponds à côté, mais avec bienveillance.",
      "Je sens une vraie énergie dans votre message. Malheureusement, je ne sens rien d'autre.",
      "Je transmets votre demande au pôle Concept. Le pôle Concept est un concept.",
    ],
  };

  /* Ordre = priorité. Le texte est normalisé (minuscules, sans accents). */
  const INTENTS = [
    ["thanks", /\b(merci|thx|thanks)\b/],
    ["bye", /\b(au revoir|bye|ciao|bonne (journee|soiree))\b/],
    ["contact", /contact|joindre|linktree|insta|reseau|mail|telephone|numero|ecrire/],
    ["human", /\b(humain|conseill|vrai(e)? personne|agent|operat|quelqu.un|service client)/],
    ["delfine", /del.?fine|neuro|spectre|autis|tdah|zebre/],
    ["corporate", /pi.?day|escape|brainstorm|employab|emploi|\bcv\b|\bjob|travail|stage|recrut|livrable|scope|swot|teambuilding|cpf/],
    ["pi", /(^|[^a-z])(pi|π)([^a-z]|$)|fondateur|coach|maieuti/],
    ["refund", /rembours|retour|annul|retract|sav\b/],
    ["delivery", /livr|colis|expedi|envoi|shipping/],
    ["price", /prix|combien|cher|tarif|cout|€|euro|promo|reduc|solde/],
    ["buy", /achet|commande|panier|payer|paiement|carte|checkout|acquerir/],
    ["waitlist", /attente|inscri|waitlist|place/],
    ["hours", /horaire|ouvert|ouvre|heure|ferme|quand/],
    ["address", /adresse|\bou\b.*(etes|est|trouv)|trouver|venir|metro|plan/],
    ["green", /eco|planete|impact|green|carbone|climat|la.?bas|bio\b|durable|arbre/],
    ["fem", /femme|feminis|sororit|egalit|parit/],
    ["what", /quoi|vende?z?\b|vendre|produit|concept|compren|expliq|kesako|c.?est quoi|sert a/],
    ["greet", /^(bonjour|bonsoir|salut|hello|hi|coucou|hey|yo)\b/],
  ];

  const QUICK = [
    ["C'est quoi, au juste ?", "C'est quoi, au juste ?"],
    ["Combien ça coûte ?", "Combien ça coûte ?"],
    ["Je veux acheter", "Je veux acheter"],
    ["Parler à un humain", "Je veux parler à un humain"],
  ];

  const norm = (t) => t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const used = {};
  function reply(intent) {
    const list = R[intent];
    used[intent] = used[intent] || [];
    if (used[intent].length >= list.length) used[intent] = [];
    let i;
    do { i = Math.floor(Math.random() * list.length); } while (used[intent].includes(i));
    used[intent].push(i);
    return fix(list[i]);
  }
  function detect(text) {
    const n = norm(text.trim());
    for (const [intent, re] of INTENTS) if (re.test(n)) return intent;
    return "fallback";
  }

  /* ---------- Interface ---------- */
  const root = document.createElement("div");
  root.className = "bot";
  root.innerHTML = `
    <div class="bot-nudge" hidden>
      <button class="bot-nudge-close" aria-label="Fermer">✕</button>
      <p>👋 Besoin d'aide pour ne pas comprendre ?</p>
    </div>
    <button class="bot-fab" aria-controls="bot-panel" aria-expanded="false" aria-label="Ouvrir la conversation avec Bütler">
      <span class="bot-avatar" aria-hidden="true">Bü</span>
      <span class="bot-fab-label">Une question ?</span>
      <span class="bot-badge" hidden>1</span>
    </button>
    <section class="bot-panel" id="bot-panel" role="dialog" aria-label="Conversation avec Bütler" hidden>
      <header class="bot-head">
        <span class="bot-avatar" aria-hidden="true">Bü</span>
        <div>
          <strong>Bütler™</strong>
          <small><i class="bot-dot"></i> Brand Experience Companion · en ligne (intérieurement)</small>
        </div>
        <button class="bot-close" aria-label="Fermer la conversation">✕</button>
      </header>
      <div class="bot-log" aria-live="polite"></div>
      <div class="bot-quick"></div>
      <form class="bot-form">
        <label class="sr-only" for="bot-input">Votre message</label>
        <input id="bot-input" autocomplete="off" maxlength="300" placeholder="Exprimez votre intention…">
        <button class="bot-send" aria-label="Envoyer">→</button>
      </form>
      <p class="bot-legal">Propulsé par une IA artisanale (Intelligence Approximative). Les réponses n'engagent personne, pas même Bütler.</p>
    </section>`;
  document.body.appendChild(root);

  const $ = (s) => root.querySelector(s);
  const fab = $(".bot-fab"), panel = $(".bot-panel"), log = $(".bot-log"), form = $(".bot-form"),
        input = $("#bot-input"), quick = $(".bot-quick"), badge = $(".bot-badge"), nudge = $(".bot-nudge");
  let started = false, busy = false, botCount = 0;

  const LINK = "https://linktr.ee/peter7nance";
  function bubble(text, who, withLink) {
    const b = document.createElement("div");
    b.className = "bot-msg from-" + who;
    b.textContent = text;
    if (withLink) {
      const a = document.createElement("a");
      a.href = LINK; a.target = "_blank"; a.rel = "noopener";
      a.className = "bot-link"; a.textContent = "linktr.ee/peter7nance ↗";
      b.appendChild(a);
    }
    log.appendChild(b);
    log.scrollTop = log.scrollHeight;
    return b;
  }
  function typing(label) {
    const t = document.createElement("div");
    t.className = "bot-msg from-bot bot-typing";
    t.innerHTML = `<span></span><span></span><span></span>${label ? `<em>${label}</em>` : ""}`;
    log.appendChild(t);
    log.scrollTop = log.scrollHeight;
    return t;
  }
  function say(text, then, withLink) {
    busy = true;
    const t = typing(Math.random() < .25 ? "Bütler réfléchit à votre place…" : "");
    const delay = Math.min(600 + text.length * 18, 2600);
    setTimeout(() => {
      t.remove();
      bubble(text, "bot", withLink);
      busy = false;
      if (panel.hidden) { badge.hidden = false; }
      if (then) then();
    }, delay);
  }
  function survey() {
    const s = document.createElement("div");
    s.className = "bot-survey";
    s.innerHTML = `<p>Cette conversation vous a-t-elle aidé·e${NB}?</p><button data-v="up">👍</button><button data-v="down">👎</button>`;
    log.appendChild(s);
    log.scrollTop = log.scrollHeight;
    s.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      s.remove();
      say(fix(b.dataset.v === "up"
        ? "Merci ! Votre satisfaction a été convertie en intention, puis en KPI."
        : "Merci pour ce feedback. Il a été transmis à π, qui vous demande : qu'est-ce qui, en vous, n'a pas été aidé ?"));
    });
  }
  function renderQuick() {
    quick.innerHTML = QUICK.map(([label, msg]) => `<button type="button" data-msg="${msg.replace(/"/g, "&quot;")}">${label}</button>`).join("");
  }
  function handle(text) {
    if (!text.trim() || busy) return;
    bubble(text.trim(), "user");
    const intent = detect(text);
    say(reply(intent), () => {
      botCount++;
      if (botCount % 3 === 0) survey();
    }, intent === "contact" || intent === "human");
  }

  function open() {
    panel.hidden = false;
    nudge.hidden = true;
    badge.hidden = true;
    fab.setAttribute("aria-expanded", "true");
    root.classList.add("open");
    if (!started) {
      started = true;
      renderQuick();
      say(reply("greet"));
    }
    setTimeout(() => input.focus({ preventScroll: true }), 50);
  }
  function close() {
    panel.hidden = true;
    fab.setAttribute("aria-expanded", "false");
    root.classList.remove("open");
    fab.focus();
  }

  fab.addEventListener("click", () => (panel.hidden ? open() : close()));
  $(".bot-close").addEventListener("click", close);
  nudge.addEventListener("click", (e) => {
    if (e.target.closest(".bot-nudge-close")) { nudge.hidden = true; return; }
    open();
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !panel.hidden) close(); });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const v = input.value;
    input.value = "";
    handle(v);
  });
  quick.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (b) handle(b.dataset.msg);
  });

  // La bulle proactive, si insistante.
  setTimeout(() => {
    if (!started) { nudge.hidden = false; badge.hidden = false; }
  }, 18000);
})();
