// ----- 1. Mode clair / sombre (mémorisé par le navigateur) -----
const racine = document.documentElement;
const bouton = document.getElementById("theme-toggle");

const themeSauvegarde = localStorage.getItem("theme");
if (themeSauvegarde) {
  racine.setAttribute("data-theme", themeSauvegarde);
}

function majIcone() {
  const estClair = racine.getAttribute("data-theme") === "light";
  bouton.textContent = estClair ? "🌙" : "☀️";
}
majIcone();

bouton.addEventListener("click", () => {
  const estClair = racine.getAttribute("data-theme") === "light";
  const nouveau = estClair ? "dark" : "light";
  racine.setAttribute("data-theme", nouveau);
  localStorage.setItem("theme", nouveau);
  majIcone();
});

// ----- 2. Apparition des sections quand on scrolle -----
const observateur = new IntersectionObserver((elements) => {
  elements.forEach((el) => {
    if (el.isIntersecting) {
      el.target.classList.add("visible");
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach((el) => observateur.observe(el));

// ----- 3. Mot qui change dans le titre (page d'accueil) -----
const mot = document.getElementById("mot");

if (mot) {
  const mots = ["créer", "imaginer", "construire", "inventer"];
  let i = 0;

  setInterval(() => {
    mot.style.opacity = 0;
    setTimeout(() => {
      i = (i + 1) % mots.length;
      mot.textContent = mots[i];
      mot.style.opacity = 1;
    }, 300);
  }, 2500);

  mot.style.transition = "opacity 0.3s";
}
// ----- 4. Menu burger (mobile) -----
const burger = document.getElementById("burger");
const menu = document.getElementById("menu");

burger.addEventListener("click", () => {
  const ouvert = menu.classList.toggle("ouvert");
  burger.textContent = ouvert ? "✕" : "☰";
});

// ----- 5. Barre de progression du scroll -----
const barre = document.createElement("div");
barre.id = "progression";
document.body.appendChild(barre);

window.addEventListener("scroll", () => {
  const hauteur = document.documentElement.scrollHeight - window.innerHeight;
  const pourcentage = hauteur > 0 ? (window.scrollY / hauteur) * 100 : 0;
  barre.style.width = pourcentage + "%";
});

// ----- 6. Halo lumineux qui suit la souris sur les cartes -----
document.querySelectorAll(".carte").forEach((carte) => {
  carte.addEventListener("mousemove", (e) => {
    const zone = carte.getBoundingClientRect();
    carte.style.setProperty("--x", e.clientX - zone.left + "px");
    carte.style.setProperty("--y", e.clientY - zone.top + "px");
  });
});

// ----- 7. Compteurs animés -----
const compteurs = document.querySelectorAll("[data-cible]");

const observateurCompteurs = new IntersectionObserver((elements) => {
  elements.forEach((el) => {
    if (!el.isIntersecting) return;

    const cible = Number(el.target.dataset.cible);
    let valeur = 0;

    const minuteur = setInterval(() => {
      valeur++;
      el.target.textContent = valeur;
      if (valeur >= cible) clearInterval(minuteur);
    }, 400);

    observateurCompteurs.unobserve(el.target);
  });
}, { threshold: 0.5 });

compteurs.forEach((c) => observateurCompteurs.observe(c));

// ----- 8. Filtres de la page Projets -----
const filtres = document.querySelectorAll(".filtre");
const projets = document.querySelectorAll(".projet");

filtres.forEach((bouton) => {
  bouton.addEventListener("click", () => {
    filtres.forEach((f) => f.classList.remove("actif"));
    bouton.classList.add("actif");

    const choix = bouton.dataset.filtre;

    projets.forEach((projet) => {
      const afficher = choix === "tous" || projet.dataset.categorie === choix;
      projet.classList.toggle("cache", !afficher);
    });
  });
});

// ----- 9. Formulaire de contact avec vérification -----
const formulaire = document.getElementById("formulaire");

if (formulaire) {
  const succes = document.getElementById("succes");

  function verifier(champ, estValide, messageErreur) {
    const bloc = champ.parentElement;
    bloc.classList.toggle("invalide", !estValide);
    bloc.querySelector(".erreur").textContent = estValide ? "" : messageErreur;
    return estValide;
  }

  formulaire.addEventListener("submit", (e) => {
    e.preventDefault();
    succes.hidden = true;

    const nom = formulaire.nom;
    const email = formulaire.email;
    const message = formulaire.message;

    const nomOk = verifier(nom, nom.value.trim().length >= 2, "Entrez votre nom (2 caractères minimum).");
    const emailOk = verifier(email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value), "Entrez une adresse email valide.");
    const messageOk = verifier(message, message.value.trim().length >= 10, "Votre message doit faire au moins 10 caractères.");

    if (nomOk && emailOk && messageOk) {
      succes.hidden = false;
      formulaire.reset();
    }
  });
}
<header>
  <nav>
    <a class="logo" href="index.html">♫ TendanceSon</a>
    <button id="burger" aria-label="Ouvrir le menu">☰</button>
    <ul id="menu">
      <li><a href="index.html" class="actif">Accueil</a></li>
      <li><a href="festivals.html">Festivals</a></li>
      <li><a href="tournees.html">Tournées</a></li>
      <li><a href="decouvertes.html">Découvertes</a></li>
      <li><a href="contact.html">Contact</a></li>
      <li><button id="theme-toggle" aria-label="Changer de thème">☀️</button></li>
    </ul>
  </nav>
</header>
// ----- 10. Compte à rebours vers le prochain événement -----
const rebours = document.querySelector(".rebours");

if (rebours) {
  const dateCible = new Date(rebours.dataset.date).getTime();

  function majRebours() {
    const reste = Math.max(0, dateCible - Date.now());
    document.getElementById("cj").textContent = Math.floor(reste / 86400000);
    document.getElementById("ch").textContent = Math.floor((reste / 3600000) % 24);
    document.getElementById("cm").textContent = Math.floor((reste / 60000) % 60);
    document.getElementById("cs").textContent = Math.floor((reste / 1000) % 60);
  }

  majRebours();
  setInterval(majRebours, 1000);
}