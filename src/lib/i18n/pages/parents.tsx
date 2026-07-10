import type { ReactNode } from "react";
import Link from "next/link";
import type { LocaleCode } from "@/lib/locale";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site-config";

function parentsPageEn(): ReactNode {
  return (
    <>
      <h2>🧩 Information for Parents – Safe, Simple, and Fun for Everyone</h2>
      <p>
        At {SITE_NAME}, we know how important it is for parents to feel confident about what their
        children play online.
      </p>
      <p>
        As gamers ourselves — and many of us parents too — we built this platform with one clear
        goal in mind:
      </p>
      <p className="parents-page-highlight">
        👉 To make free online gaming safe, fun, and family-friendly.
      </p>
      <p>
        We believe kids should enjoy the excitement of games while learning, thinking creatively,
        and exploring in a positive digital space.
      </p>

      <h2>❤️ Our Commitment to Safety</h2>
      <p>
        We take your child&apos;s online safety seriously. Every game on {SITE_NAME} goes through a
        careful review before it&apos;s published.
      </p>
      <p>We check for:</p>
      <ul>
        <li>✅ No violence or inappropriate content</li>
        <li>✅ No adult themes, gambling, or disturbing visuals</li>
        <li>✅ No misleading ads or pop-ups</li>
        <li>✅ Respect for privacy and family values</li>
      </ul>
      <p>
        Our team plays and tests every game to ensure it&apos;s suitable for general audiences.
      </p>
      <p>
        If a game contains mild action or strategy elements, it&apos;s clearly labeled so parents can
        decide what&apos;s best for their children.
      </p>

      <h2>🕹️ Why Kids Love {SITE_NAME}</h2>
      <p>
        Kids enjoy {SITE_NAME} because it&apos;s quick, colorful, and full of variety. From fun
        puzzles that challenge their brains to adventure and racing games that build coordination and
        focus, every title offers something different.
      </p>
      <p>They can play instantly — no downloads, no logins, and no complicated setup.</p>
      <p>
        Many of our games are also educational, improving memory, logic, problem-solving, and
        creativity while they have fun.
      </p>

      <h2>🧠 Learning Through Play</h2>
      <p>We believe games can be more than entertainment.</p>
      <p>They can teach patience, teamwork, and decision-making.</p>
      <p>
        Our puzzle and brain game categories include titles that help kids learn numbers, patterns,
        and logic — all in a light, playful way.
      </p>
      <p className="parents-page-highlight">We aim to make screen time smart time.</p>

      <h2>🔐 Privacy and Data Protection</h2>
      <p>We fully respect your family&apos;s privacy.</p>
      <ul>
        <li>We do not collect personal data from children.</li>
        <li>
          We do not allow chat features or user-generated content that could expose personal
          information.
        </li>
        <li>
          We comply with COPPA (Children&apos;s Online Privacy Protection Act) and GDPR standards for
          users in Europe.
        </li>
      </ul>
      <p>
        Our advertising partners follow the same strict policies — only showing child-safe and
        age-appropriate ads.
      </p>
      <p>
        If you ever see an ad or a game that concerns you, please contact us right away at{" "}
        <Link href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</Link> or through our{" "}
        <Link href="/contact">contact form</Link>.
      </p>
    </>
  );
}

function parentsPageEs(): ReactNode {
  return (
    <>
      <h2>🧩 Información para padres – Seguro, sencillo y divertido para todos</h2>
      <p>
        En {SITE_NAME}, sabemos lo importante que es para los padres sentirse seguros sobre lo que
        sus hijos juegan en línea.
      </p>
      <p>
        Como jugadores — y muchos de nosotros también somos padres — creamos esta plataforma con un
        objetivo claro:
      </p>
      <p className="parents-page-highlight">
        👉 Hacer que los juegos en línea gratuitos sean seguros, divertidos y aptos para toda la
        familia.
      </p>
      <p>
        Creemos que los niños deben disfrutar de la emoción de los juegos mientras aprenden, piensan
        con creatividad y exploran en un entorno digital positivo.
      </p>

      <h2>❤️ Nuestro compromiso con la seguridad</h2>
      <p>
        Nos tomamos muy en serio la seguridad en línea de su hijo. Cada juego en {SITE_NAME} pasa
        por una revisión cuidadosa antes de publicarse.
      </p>
      <p>Comprobamos que:</p>
      <ul>
        <li>✅ No haya violencia ni contenido inapropiado</li>
        <li>✅ No haya temas para adultos, apuestas ni imágenes perturbadoras</li>
        <li>✅ No haya anuncios engañosos ni ventanas emergentes</li>
        <li>✅ Se respeten la privacidad y los valores familiares</li>
      </ul>
      <p>
        Nuestro equipo juega y prueba cada título para asegurarse de que sea adecuado para el
        público general.
      </p>
      <p>
        Si un juego incluye acción o estrategia leve, está claramente etiquetado para que los padres
        puedan decidir qué es lo mejor para sus hijos.
      </p>

      <h2>🕹️ Por qué a los niños les encanta {SITE_NAME}</h2>
      <p>
        A los niños les gusta {SITE_NAME} porque es rápido, colorido y lleno de variedad. Desde
        divertidos puzzles que desafían su mente hasta juegos de aventura y carreras que desarrollan
        la coordinación y la concentración, cada título ofrece algo diferente.
      </p>
      <p>Pueden jugar al instante: sin descargas, sin inicios de sesión y sin configuraciones complicadas.</p>
      <p>
        Muchos de nuestros juegos también son educativos y mejoran la memoria, la lógica, la
        resolución de problemas y la creatividad mientras se divierten.
      </p>

      <h2>🧠 Aprender jugando</h2>
      <p>Creemos que los juegos pueden ser más que entretenimiento.</p>
      <p>Pueden enseñar paciencia, trabajo en equipo y toma de decisiones.</p>
      <p>
        Nuestras categorías de puzzles y juegos mentales incluyen títulos que ayudan a los niños a
        aprender números, patrones y lógica, todo de forma ligera y lúdica.
      </p>
      <p className="parents-page-highlight">Nuestro objetivo es convertir el tiempo de pantalla en tiempo inteligente.</p>

      <h2>🔐 Privacidad y protección de datos</h2>
      <p>Respetamos plenamente la privacidad de su familia.</p>
      <ul>
        <li>No recopilamos datos personales de menores.</li>
        <li>
          No permitimos funciones de chat ni contenido generado por usuarios que pueda exponer
          información personal.
        </li>
        <li>
          Cumplimos con la COPPA (Ley de Protección de la Privacidad en Línea de los Niños) y con
          los estándares del RGPD para usuarios en Europa.
        </li>
      </ul>
      <p>
        Nuestros socios publicitarios siguen las mismas políticas estrictas: solo muestran anuncios
        seguros y apropiados para la edad.
      </p>
      <p>
        Si alguna vez ve un anuncio o un juego que le preocupe, contáctenos de inmediato en{" "}
        <Link href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</Link> o a través de nuestro{" "}
        <Link href="/contact">formulario de contacto</Link>.
      </p>
    </>
  );
}

function parentsPageFr(): ReactNode {
  return (
    <>
      <h2>🧩 Informations pour les parents – Sûr, simple et amusant pour tous</h2>
      <p>
        Chez {SITE_NAME}, nous savons à quel point il est important pour les parents d&apos;avoir
        confiance dans ce que leurs enfants jouent en ligne.
      </p>
      <p>
        En tant que joueurs — et beaucoup d&apos;entre nous sont aussi parents — nous avons créé
        cette plateforme avec un objectif clair :
      </p>
      <p className="parents-page-highlight">
        👉 Rendre le jeu en ligne gratuit sûr, amusant et adapté aux familles.
      </p>
      <p>
        Nous croyons que les enfants doivent profiter de l&apos;excitation des jeux tout en
        apprenant, en réfléchissant avec créativité et en explorant dans un espace numérique
        positif.
      </p>

      <h2>❤️ Notre engagement en matière de sécurité</h2>
      <p>
        Nous prenons la sécurité en ligne de votre enfant très au sérieux. Chaque jeu sur{" "}
        {SITE_NAME} fait l&apos;objet d&apos;un examen attentif avant sa publication.
      </p>
      <p>Nous vérifions notamment :</p>
      <ul>
        <li>✅ L&apos;absence de violence ou de contenu inapproprié</li>
        <li>✅ L&apos;absence de thèmes adultes, de jeux d&apos;argent ou d&apos;images choquantes</li>
        <li>✅ L&apos;absence de publicités trompeuses ou de fenêtres pop-up</li>
        <li>✅ Le respect de la vie privée et des valeurs familiales</li>
      </ul>
      <p>
        Notre équipe joue et teste chaque jeu pour s&apos;assurer qu&apos;il convient au grand
        public.
      </p>
      <p>
        Si un jeu contient des éléments d&apos;action ou de stratégie légers, il est clairement
        étiqueté afin que les parents puissent décider de ce qui convient le mieux à leurs enfants.
      </p>

      <h2>🕹️ Pourquoi les enfants adorent {SITE_NAME}</h2>
      <p>
        Les enfants apprécient {SITE_NAME} parce que c&apos;est rapide, coloré et varié. Des puzzles
        amusants qui stimulent leur esprit aux jeux d&apos;aventure et de course qui développent la
        coordination et la concentration, chaque titre offre quelque chose de différent.
      </p>
      <p>
        Ils peuvent jouer instantanément — sans téléchargement, sans connexion et sans configuration
        compliquée.
      </p>
      <p>
        Beaucoup de nos jeux sont également éducatifs et améliorent la mémoire, la logique, la
        résolution de problèmes et la créativité tout en s&apos;amusant.
      </p>

      <h2>🧠 Apprendre en jouant</h2>
      <p>Nous croyons que les jeux peuvent être plus qu&apos;un simple divertissement.</p>
      <p>Ils peuvent enseigner la patience, le travail d&apos;équipe et la prise de décision.</p>
      <p>
        Nos catégories de puzzles et de jeux de réflexion comprennent des titres qui aident les
        enfants à apprendre les nombres, les motifs et la logique — le tout de manière légère et
        ludique.
      </p>
      <p className="parents-page-highlight">
        Notre objectif : faire du temps d&apos;écran un temps intelligent.
      </p>

      <h2>🔐 Confidentialité et protection des données</h2>
      <p>Nous respectons pleinement la vie privée de votre famille.</p>
      <ul>
        <li>Nous ne collectons pas de données personnelles auprès des enfants.</li>
        <li>
          Nous n&apos;autorisons pas les fonctions de chat ni le contenu généré par les utilisateurs
          susceptibles d&apos;exposer des informations personnelles.
        </li>
        <li>
          Nous respectons la COPPA (Children&apos;s Online Privacy Protection Act) et les normes du
          RGPD pour les utilisateurs en Europe.
        </li>
      </ul>
      <p>
        Nos partenaires publicitaires suivent les mêmes politiques strictes — ils n&apos;affichent
        que des publicités sûres et adaptées à l&apos;âge.
      </p>
      <p>
        Si vous voyez une publicité ou un jeu qui vous inquiète, contactez-nous immédiatement à{" "}
        <Link href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</Link> ou via notre{" "}
        <Link href="/contact">formulaire de contact</Link>.
      </p>
    </>
  );
}

function parentsPageNl(): ReactNode {
  return (
    <>
      <h2>🧩 Informatie voor ouders – Veilig, eenvoudig en leuk voor iedereen</h2>
      <p>
        Bij {SITE_NAME} weten we hoe belangrijk het is dat ouders vertrouwen hebben in wat hun
        kinderen online spelen.
      </p>
      <p>
        Als gamers — en velen van ons zijn zelf ook ouder — hebben we dit platform gebouwd met één
        duidelijk doel:
      </p>
      <p className="parents-page-highlight">
        👉 Gratis online gamen veilig, leuk en gezinsvriendelijk maken.
      </p>
      <p>
        Wij geloven dat kinderen moeten genieten van de spanning van games terwijl ze leren,
        creatief denken en ontdekken in een positieve digitale omgeving.
      </p>

      <h2>❤️ Onze toewijding aan veiligheid</h2>
      <p>
        We nemen de online veiligheid van uw kind serieus. Elke game op {SITE_NAME} wordt zorgvuldig
        beoordeeld voordat deze wordt gepubliceerd.
      </p>
      <p>We controleren op:</p>
      <ul>
        <li>✅ Geen geweld of ongepaste inhoud</li>
        <li>✅ Geen volwassen thema&apos;s, gokken of verontrustende beelden</li>
        <li>✅ Geen misleidende advertenties of pop-ups</li>
        <li>✅ Respect voor privacy en familiewaarden</li>
      </ul>
      <p>
        Ons team speelt en test elke game om te zorgen dat deze geschikt is voor een breed publiek.
      </p>
      <p>
        Als een game milde actie- of strategie-elementen bevat, is dit duidelijk gelabeld zodat
        ouders kunnen beslissen wat het beste is voor hun kinderen.
      </p>

      <h2>🕹️ Waarom kinderen van {SITE_NAME} houden</h2>
      <p>
        Kinderen genieten van {SITE_NAME} omdat het snel, kleurrijk en gevarieerd is. Van leuke
        puzzels die hun brein uitdagen tot avontuur- en racespellen die coördinatie en focus
        ontwikkelen — elk spel biedt iets anders.
      </p>
      <p>Ze kunnen direct spelen — geen downloads, geen inloggen en geen ingewikkelde setup.</p>
      <p>
        Veel van onze spellen zijn ook educatief en verbeteren geheugen, logica, probleemoplossing
        en creativiteit terwijl ze plezier hebben.
      </p>

      <h2>🧠 Leren door te spelen</h2>
      <p>Wij geloven dat games meer kunnen zijn dan vermaak.</p>
      <p>Ze kunnen geduld, teamwork en besluitvorming bijbrengen.</p>
      <p>
        Onze puzzel- en breincategorieën bevatten titels die kinderen helpen cijfers, patronen en
        logica te leren — allemaal op een lichte, speelse manier.
      </p>
      <p className="parents-page-highlight">We willen schermtijd slimme tijd maken.</p>

      <h2>🔐 Privacy en gegevensbescherming</h2>
      <p>We respecteren de privacy van uw gezin volledig.</p>
      <ul>
        <li>We verzamelen geen persoonsgegevens van kinderen.</li>
        <li>
          We bieden geen chatfuncties of door gebruikers gegenereerde inhoud die persoonlijke
          informatie kan blootstellen.
        </li>
        <li>
          We voldoen aan COPPA (Children&apos;s Online Privacy Protection Act) en GDPR-normen voor
          gebruikers in Europa.
        </li>
      </ul>
      <p>
        Onze advertentiepartners volgen hetzelfde strikte beleid — ze tonen alleen kindveilige en
        leeftijdsgeschikte advertenties.
      </p>
      <p>
        Als u ooit een advertentie of game ziet die u zorgen baart, neem dan direct contact met ons
        op via <Link href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</Link> of via ons{" "}
        <Link href="/contact">contactformulier</Link>.
      </p>
    </>
  );
}

export function getParentsPageContent(locale: LocaleCode): ReactNode {
  switch (locale) {
    case "es":
      return parentsPageEs();
    case "fr":
      return parentsPageFr();
    case "nl":
      return parentsPageNl();
    default:
      return parentsPageEn();
  }
}
