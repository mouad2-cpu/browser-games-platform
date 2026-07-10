import type { LocaleCode } from "@/lib/locale";
import { SITE_NAME } from "@/lib/site-config";

export type AboutSectionId = "hero" | "journey" | "mission" | "promise" | "team" | "join";

export type AboutPromiseCard = {
  icon: string;
  title: string;
  description: string;
};

export type AboutPageContentData = {
  ariaLabel: string;
  navAriaLabel: string;
  goToSectionAriaLabel: (sectionLabel: string) => string;
  sections: readonly { id: AboutSectionId; label: string }[];
  hero: {
    kicker: string;
    title: string;
    subtitle: string;
    cta: string;
  };
  journey: {
    title: string;
    text: string;
    cta: string;
  };
  mission: {
    title: string;
    cta: string;
  };
  promise: {
    title: string;
    cards: readonly AboutPromiseCard[];
    cta: string;
  };
  team: {
    title: string;
    text: string;
    cta: string;
  };
  join: {
    title: string;
    text: string;
    cta: string;
  };
};

const aboutPageEn = (): AboutPageContentData => ({
  ariaLabel: "About page sections",
  navAriaLabel: "Page sections",
  goToSectionAriaLabel: (sectionLabel) => `Go to section: ${sectionLabel}`,
  sections: [
    { id: "hero", label: "Hero" },
    { id: "journey", label: "Our Journey" },
    { id: "mission", label: "Mission" },
    { id: "promise", label: "Our Promise" },
    { id: "team", label: "Team" },
    { id: "join", label: "Join" },
  ],
  hero: {
    kicker: `About ${SITE_NAME}`,
    title: "We let the world play.",
    subtitle: `Welcome to ${SITE_NAME} — your go-to spot for free online games. No downloads. No waiting.`,
    cta: "Start Adventure",
  },
  journey: {
    title: "Our Journey",
    text: `What started as a side project has grown into a place where thousands of players discover new games every day. We've curated hundreds of hand-picked games so you can jump straight into the fun — no sign-up required.`,
    cta: "So... what's next? →",
  },
  mission: {
    title: "Make online gaming easy, enjoyable, and accessible for everyone.",
    cta: "Nice... →",
  },
  promise: {
    title: "Our Promise",
    cards: [
      {
        icon: "∞",
        title: "Free Forever",
        description: "No hidden fees, no subscriptions. Every game is 100% free to play.",
      },
      {
        icon: "⚡",
        title: "Instant Play",
        description: "No downloads. Click and play in your browser — anywhere, anytime.",
      },
      {
        icon: "◆",
        title: "Safe for Everyone",
        description: "Hand-picked, family-friendly games for players of all ages.",
      },
      {
        icon: "+",
        title: "Always Fresh",
        description: "New games added regularly. Always something new to discover.",
      },
    ],
    cta: "Ready? →",
  },
  team: {
    title: `The People Behind ${SITE_NAME}`,
    text: `We're a small team of gamers and builders who believe play should be simple and stress-free. Every game on ${SITE_NAME} is chosen with care — so you get a fun, safe experience that's all about the joy of playing.`,
    cta: "Join the adventure →",
  },
  join: {
    title: "Join the Adventure",
    text: "Your free browser gaming hub — zero downloads, zero sign-up. Play instantly from any device, anywhere.",
    cta: "Start Playing Now",
  },
});

const aboutPageEs = (): AboutPageContentData => ({
  ariaLabel: "Secciones de la página Acerca de",
  navAriaLabel: "Secciones de la página",
  goToSectionAriaLabel: (sectionLabel) => `Ir a la sección: ${sectionLabel}`,
  sections: [
    { id: "hero", label: "Inicio" },
    { id: "journey", label: "Nuestro recorrido" },
    { id: "mission", label: "Misión" },
    { id: "promise", label: "Nuestra promesa" },
    { id: "team", label: "Equipo" },
    { id: "join", label: "Únete" },
  ],
  hero: {
    kicker: `Acerca de ${SITE_NAME}`,
    title: "Dejamos que el mundo juegue.",
    subtitle: `Bienvenido a ${SITE_NAME} — tu lugar de referencia para juegos en línea gratuitos. Sin descargas. Sin esperas.`,
    cta: "Comenzar la aventura",
  },
  journey: {
    title: "Nuestro recorrido",
    text: `Lo que comenzó como un proyecto paralelo se ha convertido en un lugar donde miles de jugadores descubren nuevos juegos cada día. Hemos seleccionado cientos de títulos a mano para que puedas sumergirte directamente en la diversión, sin necesidad de registrarte.`,
    cta: "Entonces... ¿qué sigue? →",
  },
  mission: {
    title: "Hacer que los juegos en línea sean fáciles, agradables y accesibles para todos.",
    cta: "Genial... →",
  },
  promise: {
    title: "Nuestra promesa",
    cards: [
      {
        icon: "∞",
        title: "Gratis para siempre",
        description: "Sin costes ocultos ni suscripciones. Todos los juegos son 100 % gratuitos.",
      },
      {
        icon: "⚡",
        title: "Juego instantáneo",
        description: "Sin descargas. Haz clic y juega en tu navegador, donde y cuando quieras.",
      },
      {
        icon: "◆",
        title: "Seguro para todos",
        description: "Juegos seleccionados a mano y aptos para toda la familia, para jugadores de todas las edades.",
      },
      {
        icon: "+",
        title: "Siempre renovado",
        description: "Nuevos juegos añadidos con regularidad. Siempre hay algo nuevo por descubrir.",
      },
    ],
    cta: "¿Listo? →",
  },
  team: {
    title: `Las personas detrás de ${SITE_NAME}`,
    text: `Somos un equipo pequeño de jugadores y creadores que cree que jugar debe ser sencillo y sin estrés. Cada juego en ${SITE_NAME} se elige con cuidado para ofrecerte una experiencia divertida y segura centrada en el placer de jugar.`,
    cta: "Únete a la aventura →",
  },
  join: {
    title: "Únete a la aventura",
    text: "Tu centro de juegos en el navegador, gratis: cero descargas, cero registro. Juega al instante desde cualquier dispositivo y en cualquier lugar.",
    cta: "Empezar a jugar ahora",
  },
});

const aboutPageFr = (): AboutPageContentData => ({
  ariaLabel: "Sections de la page À propos",
  navAriaLabel: "Sections de la page",
  goToSectionAriaLabel: (sectionLabel) => `Aller à la section : ${sectionLabel}`,
  sections: [
    { id: "hero", label: "Accueil" },
    { id: "journey", label: "Notre parcours" },
    { id: "mission", label: "Mission" },
    { id: "promise", label: "Notre promesse" },
    { id: "team", label: "Équipe" },
    { id: "join", label: "Rejoindre" },
  ],
  hero: {
    kicker: `À propos de ${SITE_NAME}`,
    title: "Nous laissons le monde jouer.",
    subtitle: `Bienvenue sur ${SITE_NAME} — votre destination pour des jeux en ligne gratuits. Pas de téléchargement. Pas d'attente.`,
    cta: "Commencer l'aventure",
  },
  journey: {
    title: "Notre parcours",
    text: `Ce qui a commencé comme un projet parallèle est devenu un lieu où des milliers de joueurs découvrent de nouveaux jeux chaque jour. Nous avons sélectionné des centaines de jeux triés sur le volet pour que vous puissiez plonger directement dans le plaisir — sans inscription.`,
    cta: "Alors... la suite ? →",
  },
  mission: {
    title: "Rendre le jeu en ligne simple, agréable et accessible à tous.",
    cta: "Sympa... →",
  },
  promise: {
    title: "Notre promesse",
    cards: [
      {
        icon: "∞",
        title: "Gratuit pour toujours",
        description: "Pas de frais cachés, pas d'abonnement. Chaque jeu est 100 % gratuit.",
      },
      {
        icon: "⚡",
        title: "Jeu instantané",
        description: "Pas de téléchargement. Cliquez et jouez dans votre navigateur — partout, à tout moment.",
      },
      {
        icon: "◆",
        title: "Sûr pour tous",
        description: "Des jeux triés sur le volet et adaptés aux familles, pour les joueurs de tous âges.",
      },
      {
        icon: "+",
        title: "Toujours renouvelé",
        description: "De nouveaux jeux ajoutés régulièrement. Toujours quelque chose de nouveau à découvrir.",
      },
    ],
    cta: "Prêt ? →",
  },
  team: {
    title: `Les personnes derrière ${SITE_NAME}`,
    text: `Nous sommes une petite équipe de joueurs et de créateurs qui croient que jouer doit rester simple et sans stress. Chaque jeu sur ${SITE_NAME} est choisi avec soin — pour vous offrir une expérience amusante et sûre, centrée sur le plaisir de jouer.`,
    cta: "Rejoindre l'aventure →",
  },
  join: {
    title: "Rejoindre l'aventure",
    text: "Votre hub de jeux navigateur gratuit — zéro téléchargement, zéro inscription. Jouez instantanément depuis n'importe quel appareil, où que vous soyez.",
    cta: "Commencer à jouer",
  },
});

const aboutPageNl = (): AboutPageContentData => ({
  ariaLabel: "Over ons-paginasecties",
  navAriaLabel: "Paginasecties",
  goToSectionAriaLabel: (sectionLabel) => `Ga naar sectie: ${sectionLabel}`,
  sections: [
    { id: "hero", label: "Start" },
    { id: "journey", label: "Onze reis" },
    { id: "mission", label: "Missie" },
    { id: "promise", label: "Onze belofte" },
    { id: "team", label: "Team" },
    { id: "join", label: "Doe mee" },
  ],
  hero: {
    kicker: `Over ${SITE_NAME}`,
    title: "Wij laten de wereld spelen.",
    subtitle: `Welkom bij ${SITE_NAME} — jouw plek voor gratis online games. Geen downloads. Geen wachttijd.`,
    cta: "Start het avontuur",
  },
  journey: {
    title: "Onze reis",
    text: `Wat begon als een bijproject is uitgegroeid tot een plek waar duizenden spelers elke dag nieuwe games ontdekken. We hebben honderden zorgvuldig gekozen spellen samengesteld, zodat je direct in het plezier kunt duiken — zonder registratie.`,
    cta: "Dus... wat nu? →",
  },
  mission: {
    title: "Online gamen eenvoudig, leuk en toegankelijk maken voor iedereen.",
    cta: "Mooi... →",
  },
  promise: {
    title: "Onze belofte",
    cards: [
      {
        icon: "∞",
        title: "Voor altijd gratis",
        description: "Geen verborgen kosten, geen abonnementen. Elke game is 100% gratis te spelen.",
      },
      {
        icon: "⚡",
        title: "Direct spelen",
        description: "Geen downloads. Klik en speel in je browser — overal en altijd.",
      },
      {
        icon: "◆",
        title: "Veilig voor iedereen",
        description: "Zorgvuldig gekozen, gezinsvriendelijke games voor spelers van alle leeftijden.",
      },
      {
        icon: "+",
        title: "Altijd vernieuwend",
        description: "Regelmatig nieuwe games. Altijd iets nieuws om te ontdekken.",
      },
    ],
    cta: "Klaar? →",
  },
  team: {
    title: `De mensen achter ${SITE_NAME}`,
    text: `We zijn een klein team van gamers en bouwers die geloven dat spelen eenvoudig en stressvrij moet zijn. Elke game op ${SITE_NAME} wordt zorgvuldig gekozen — zodat je een leuke, veilige ervaring krijgt die draait om het plezier van het spelen.`,
    cta: "Doe mee met het avontuur →",
  },
  join: {
    title: "Doe mee met het avontuur",
    text: "Jouw gratis browsergame-hub — nul downloads, nul registratie. Speel direct vanaf elk apparaat, overal.",
    cta: "Nu beginnen met spelen",
  },
});

export function getAboutPageContent(locale: LocaleCode): AboutPageContentData {
  switch (locale) {
    case "es":
      return aboutPageEs();
    case "fr":
      return aboutPageFr();
    case "nl":
      return aboutPageNl();
    default:
      return aboutPageEn();
  }
}
