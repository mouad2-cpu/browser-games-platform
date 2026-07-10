import type { ReactNode } from "react";
import Link from "next/link";
import type { LocaleCode } from "@/lib/locale";
import { LEGAL_EMAIL, SITE_NAME, SITE_URL } from "@/lib/site-config";

function cookieStatementEn(): ReactNode {
  return (
    <>
      <p>Last Updated: June 2026</p>
      <p>
        At {SITE_NAME}, we want your experience to be safe, fun, and smooth. To do this, our website
        uses cookies and similar technologies to improve performance, remember your preferences, and
        provide personalized content — including advertising that is age-appropriate where applicable.
      </p>
      <p>
        This Cookie Statement explains what cookies are, how we use them, and how you can manage your
        preferences.
      </p>

      <h2>1. What Are Cookies?</h2>
      <p>
        Cookies are small text files stored on your device (computer, tablet, or smartphone) when you
        visit a website. They help the website:
      </p>
      <ul>
        <li>Recognize your device on future visits</li>
        <li>Remember your game preferences or recently played games</li>
        <li>Analyze traffic and improve site performance</li>
        <li>Show relevant and safe ads where applicable</li>
      </ul>
      <p>Cookies are widely used across the internet and do not harm your device.</p>

      <h2>2. Types of Cookies We Use</h2>
      <p>{SITE_NAME} uses the following types of cookies:</p>

      <h3 className="parents-page-highlight">Essential Cookies</h3>
      <p>These cookies are required for the website to function properly. They:</p>
      <ul>
        <li>Enable basic navigation and gameplay</li>
        <li>Remember session and security settings</li>
        <li>Support features such as recently played games</li>
        <li>Cannot be turned off in our systems without affecting core functionality</li>
      </ul>

      <h3 className="parents-page-highlight">Performance &amp; Analytics Cookies</h3>
      <p>These help us understand how visitors use our site so we can improve it. They may:</p>
      <ul>
        <li>Track page visits and user flow</li>
        <li>Measure game popularity and session duration</li>
        <li>Use aggregated, anonymous data for internal analytics</li>
      </ul>

      <h3 className="parents-page-highlight">Advertising &amp; Targeting Cookies</h3>
      <p>
        We may use cookies to display age-appropriate ads and measure their effectiveness. They help:
      </p>
      <ul>
        <li>Show relevant ads without tracking unnecessary personal information</li>
        <li>Support compliance with COPPA and GDPR where applicable</li>
      </ul>

      <h3 className="parents-page-highlight">Third-Party Cookies</h3>
      <p>
        Some games may embed content from external partners (for example, HTML5 games hosted
        elsewhere). These partners may set cookies to deliver the game experience or track game
        interactions. We review third-party content for safety and compliance where possible.
      </p>

      <h2>3. Managing Cookies</h2>
      <p>You can manage or disable cookies at any time by:</p>
      <ul>
        <li>Adjusting your browser settings to block or delete cookies</li>
        <li>Using privacy or tracking extensions</li>
        <li>Opting out of personalized advertising via industry opt-out tools where available</li>
      </ul>
      <p>
        <strong className="parents-page-highlight">Note:</strong> Disabling some cookies may affect
        gameplay, login sessions, or site functionality such as remembering recently played games.
      </p>

      <h2>4. Consent for Cookies</h2>
      <p>
        When you first visit {SITE_NAME}, you may see a cookie consent notice. By continuing to use
        the site or accepting cookies where prompted, you agree to the use of cookies as described in
        this statement and our <Link href="/privacy-policy">Privacy Policy</Link>.
      </p>
      <p>
        If you do not consent, only essential cookies will be used, and some features (like saving
        game progress or personalized ads) may not work fully.
      </p>

      <h2>5. Our Commitment to Privacy</h2>
      <p>
        We do not knowingly collect personal information from children without parental consent. We
        aim to comply with:
      </p>
      <ul>
        <li>GDPR (European Union)</li>
        <li>ePrivacy Directive</li>
        <li>COPPA (Children&apos;s Online Privacy Protection Act, USA)</li>
      </ul>
      <p>
        Data collected via cookies is used anonymously or in aggregated form where possible and is
        not sold to third parties.
      </p>

      <h2>6. Contact Us</h2>
      <p>If you have questions about our cookie practices or want to request changes, contact us:</p>
      <p>
        {SITE_NAME}
        <br />
        📧 Email: <Link href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</Link>
        <br />
        🌐 Website: <Link href={SITE_URL}>{SITE_URL}</Link>
      </p>
      <p>
        {SITE_NAME} — making browser gaming safe, fun, and respectful of your privacy.
      </p>
    </>
  );
}

function cookieStatementEs(): ReactNode {
  return (
    <>
      <p>Última actualización: junio de 2026</p>
      <p>
        En {SITE_NAME}, queremos que tu experiencia sea segura, divertida y fluida. Para ello, nuestro
        sitio web utiliza cookies y tecnologías similares para mejorar el rendimiento, recordar tus
        preferencias y ofrecer contenido personalizado — incluida publicidad adecuada a la edad cuando
        corresponda.
      </p>
      <p>
        Esta Declaración de cookies explica qué son las cookies, cómo las usamos y cómo puedes gestionar
        tus preferencias.
      </p>

      <h2>1. ¿Qué son las cookies?</h2>
      <p>
        Las cookies son pequeños archivos de texto almacenados en tu dispositivo (ordenador, tableta o
        smartphone) cuando visitas un sitio web. Ayudan al sitio a:
      </p>
      <ul>
        <li>Reconocer tu dispositivo en visitas futuras</li>
        <li>Recordar tus preferencias de juego o juegos jugados recientemente</li>
        <li>Analizar el tráfico y mejorar el rendimiento del sitio</li>
        <li>Mostrar anuncios relevantes y seguros cuando corresponda</li>
      </ul>
      <p>Las cookies se usan ampliamente en internet y no dañan tu dispositivo.</p>

      <h2>2. Tipos de cookies que usamos</h2>
      <p>{SITE_NAME} utiliza los siguientes tipos de cookies:</p>

      <h3 className="parents-page-highlight">Cookies esenciales</h3>
      <p>Estas cookies son necesarias para que el sitio funcione correctamente. Permiten:</p>
      <ul>
        <li>La navegación básica y el juego</li>
        <li>Recordar la sesión y la configuración de seguridad</li>
        <li>Funciones como juegos jugados recientemente</li>
        <li>No pueden desactivarse en nuestros sistemas sin afectar la funcionalidad principal</li>
      </ul>

      <h3 className="parents-page-highlight">Cookies de rendimiento y análisis</h3>
      <p>Nos ayudan a entender cómo los visitantes usan el sitio para mejorarlo. Pueden:</p>
      <ul>
        <li>Registrar visitas a páginas y flujo de usuarios</li>
        <li>Medir la popularidad de juegos y la duración de sesiones</li>
        <li>Usar datos agregados y anónimos para análisis interno</li>
      </ul>

      <h3 className="parents-page-highlight">Cookies de publicidad y segmentación</h3>
      <p>
        Podemos usar cookies para mostrar anuncios adecuados a la edad y medir su eficacia. Ayudan a:
      </p>
      <ul>
        <li>Mostrar anuncios relevantes sin rastrear información personal innecesaria</li>
        <li>Apoyar el cumplimiento de COPPA y GDPR cuando corresponda</li>
      </ul>

      <h3 className="parents-page-highlight">Cookies de terceros</h3>
      <p>
        Algunos juegos pueden integrar contenido de socios externos (por ejemplo, juegos HTML5 alojados
        en otro lugar). Estos socios pueden establecer cookies para ofrecer la experiencia de juego o
        registrar interacciones. Revisamos el contenido de terceros por seguridad y cumplimiento cuando
        es posible.
      </p>

      <h2>3. Gestión de cookies</h2>
      <p>Puedes gestionar o desactivar las cookies en cualquier momento:</p>
      <ul>
        <li>Ajustando la configuración del navegador para bloquear o eliminar cookies</li>
        <li>Usando extensiones de privacidad o anti-rastreo</li>
        <li>Optando por no recibir publicidad personalizada mediante herramientas del sector cuando estén disponibles</li>
      </ul>
      <p>
        <strong className="parents-page-highlight">Nota:</strong> Desactivar algunas cookies puede
        afectar el juego, las sesiones de inicio de sesión o funciones como recordar juegos jugados
        recientemente.
      </p>

      <h2>4. Consentimiento para cookies</h2>
      <p>
        La primera vez que visites {SITE_NAME}, puedes ver un aviso de consentimiento de cookies. Al
        seguir usando el sitio o aceptar cookies cuando se te solicite, aceptas el uso de cookies
        descrito en esta declaración y en nuestra{" "}
        <Link href="/privacy-policy">Política de privacidad</Link>.
      </p>
      <p>
        Si no das tu consentimiento, solo se usarán cookies esenciales y algunas funciones (como guardar
        el progreso del juego o anuncios personalizados) pueden no funcionar por completo.
      </p>

      <h2>5. Nuestro compromiso con la privacidad</h2>
      <p>
        No recopilamos a sabiendas información personal de menores sin consentimiento parental. Buscamos
        cumplir con:
      </p>
      <ul>
        <li>GDPR (Unión Europea)</li>
        <li>Directiva ePrivacy</li>
        <li>COPPA (Ley de protección de la privacidad en línea de menores, EE. UU.)</li>
      </ul>
      <p>
        Los datos recopilados mediante cookies se usan de forma anónima o agregada cuando es posible y no
        se venden a terceros.
      </p>

      <h2>6. Contáctanos</h2>
      <p>Si tienes preguntas sobre nuestras prácticas de cookies o quieres solicitar cambios, contáctanos:</p>
      <p>
        {SITE_NAME}
        <br />
        📧 Correo: <Link href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</Link>
        <br />
        🌐 Sitio web: <Link href={SITE_URL}>{SITE_URL}</Link>
      </p>
      <p>
        {SITE_NAME} — haciendo que los juegos de navegador sean seguros, divertidos y respetuosos con tu
        privacidad.
      </p>
    </>
  );
}

function cookieStatementFr(): ReactNode {
  return (
    <>
      <p>Dernière mise à jour : juin 2026</p>
      <p>
        Chez {SITE_NAME}, nous voulons que votre expérience soit sûre, amusante et fluide. Pour cela,
        notre site utilise des cookies et des technologies similaires pour améliorer les performances,
        mémoriser vos préférences et proposer du contenu personnalisé — y compris une publicité adaptée
        à l&apos;âge le cas échéant.
      </p>
      <p>
        Cette Déclaration sur les cookies explique ce que sont les cookies, comment nous les utilisons
        et comment gérer vos préférences.
      </p>

      <h2>1. Que sont les cookies ?</h2>
      <p>
        Les cookies sont de petits fichiers texte stockés sur votre appareil (ordinateur, tablette ou
        smartphone) lorsque vous visitez un site web. Ils aident le site à :
      </p>
      <ul>
        <li>Reconnaître votre appareil lors de visites ultérieures</li>
        <li>Mémoriser vos préférences de jeu ou les jeux récemment joués</li>
        <li>Analyser le trafic et améliorer les performances du site</li>
        <li>Afficher des publicités pertinentes et sûres le cas échéant</li>
      </ul>
      <p>Les cookies sont largement utilisés sur Internet et n&apos;endommagent pas votre appareil.</p>

      <h2>2. Types de cookies que nous utilisons</h2>
      <p>{SITE_NAME} utilise les types de cookies suivants :</p>

      <h3 className="parents-page-highlight">Cookies essentiels</h3>
      <p>Ces cookies sont nécessaires au bon fonctionnement du site. Ils :</p>
      <ul>
        <li>Permettent la navigation de base et le jeu</li>
        <li>Mémorisent les paramètres de session et de sécurité</li>
        <li>Prendent en charge des fonctionnalités comme les jeux récemment joués</li>
        <li>Ne peuvent pas être désactivés dans nos systèmes sans affecter les fonctionnalités essentielles</li>
      </ul>

      <h3 className="parents-page-highlight">Cookies de performance et d&apos;analyse</h3>
      <p>Ils nous aident à comprendre comment les visiteurs utilisent le site pour l&apos;améliorer. Ils peuvent :</p>
      <ul>
        <li>Suivre les visites de pages et le parcours utilisateur</li>
        <li>Mesurer la popularité des jeux et la durée des sessions</li>
        <li>Utiliser des données agrégées et anonymes pour l&apos;analyse interne</li>
      </ul>

      <h3 className="parents-page-highlight">Cookies publicitaires et de ciblage</h3>
      <p>
        Nous pouvons utiliser des cookies pour afficher des publicités adaptées à l&apos;âge et mesurer
        leur efficacité. Ils aident à :
      </p>
      <ul>
        <li>Afficher des publicités pertinentes sans suivre d&apos;informations personnelles inutiles</li>
        <li>Soutenir la conformité au RGPD et à la COPPA le cas échéant</li>
      </ul>

      <h3 className="parents-page-highlight">Cookies tiers</h3>
      <p>
        Certains jeux peuvent intégrer du contenu de partenaires externes (par exemple, des jeux HTML5
        hébergés ailleurs). Ces partenaires peuvent définir des cookies pour fournir l&apos;expérience
        de jeu ou suivre les interactions. Nous examinons le contenu tiers pour la sécurité et la
        conformité lorsque c&apos;est possible.
      </p>

      <h2>3. Gestion des cookies</h2>
      <p>Vous pouvez gérer ou désactiver les cookies à tout moment en :</p>
      <ul>
        <li>Ajustant les paramètres de votre navigateur pour bloquer ou supprimer les cookies</li>
        <li>Utilisant des extensions de confidentialité ou anti-suivi</li>
        <li>Vous désinscrivant de la publicité personnalisée via les outils sectoriels disponibles</li>
      </ul>
      <p>
        <strong className="parents-page-highlight">Remarque :</strong> La désactivation de certains
        cookies peut affecter le jeu, les sessions de connexion ou des fonctionnalités comme la
        mémorisation des jeux récemment joués.
      </p>

      <h2>4. Consentement aux cookies</h2>
      <p>
        Lors de votre première visite sur {SITE_NAME}, vous pouvez voir un avis de consentement aux
        cookies. En continuant à utiliser le site ou en acceptant les cookies lorsque demandé, vous
        acceptez l&apos;utilisation des cookies telle que décrite dans cette déclaration et notre{" "}
        <Link href="/privacy-policy">Politique de confidentialité</Link>.
      </p>
      <p>
        Si vous ne consentez pas, seuls les cookies essentiels seront utilisés et certaines
        fonctionnalités (comme la sauvegarde de progression ou les publicités personnalisées) peuvent ne
        pas fonctionner pleinement.
      </p>

      <h2>5. Notre engagement en matière de confidentialité</h2>
      <p>
        Nous ne collectons pas sciemment d&apos;informations personnelles d&apos;enfants sans
        consentement parental. Nous visons la conformité avec :
      </p>
      <ul>
        <li>RGPD (Union européenne)</li>
        <li>Directive ePrivacy</li>
        <li>COPPA (Children&apos;s Online Privacy Protection Act, États-Unis)</li>
      </ul>
      <p>
        Les données collectées via les cookies sont utilisées de manière anonyme ou agrégée lorsque
        possible et ne sont pas vendues à des tiers.
      </p>

      <h2>6. Nous contacter</h2>
      <p>
        Si vous avez des questions sur nos pratiques en matière de cookies ou souhaitez demander des
        modifications, contactez-nous :
      </p>
      <p>
        {SITE_NAME}
        <br />
        📧 E-mail : <Link href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</Link>
        <br />
        🌐 Site web : <Link href={SITE_URL}>{SITE_URL}</Link>
      </p>
      <p>
        {SITE_NAME} — rendre le jeu navigateur sûr, amusant et respectueux de votre vie privée.
      </p>
    </>
  );
}

function cookieStatementNl(): ReactNode {
  return (
    <>
      <p>Laatst bijgewerkt: juni 2026</p>
      <p>
        Bij {SITE_NAME} willen we dat je ervaring veilig, leuk en soepel is. Daarvoor gebruikt onze
        website cookies en vergelijkbare technologieën om prestaties te verbeteren, je voorkeuren te
        onthouden en gepersonaliseerde inhoud te bieden — inclusief leeftijdsgeschikte advertenties
        waar van toepassing.
      </p>
      <p>
        Deze Cookieverklaring legt uit wat cookies zijn, hoe we ze gebruiken en hoe je je voorkeuren
        kunt beheren.
      </p>

      <h2>1. Wat zijn cookies?</h2>
      <p>
        Cookies zijn kleine tekstbestanden die op je apparaat (computer, tablet of smartphone) worden
        opgeslagen wanneer je een website bezoekt. Ze helpen de website om:
      </p>
      <ul>
        <li>Je apparaat bij volgende bezoeken te herkennen</li>
        <li>Je gamevoorkeuren of recent gespeelde games te onthouden</li>
        <li>Verkeer te analyseren en de siteprestaties te verbeteren</li>
        <li>Relevante en veilige advertenties te tonen waar van toepassing</li>
      </ul>
      <p>Cookies worden veel gebruikt op internet en beschadigen je apparaat niet.</p>

      <h2>2. Soorten cookies die we gebruiken</h2>
      <p>{SITE_NAME} gebruikt de volgende soorten cookies:</p>

      <h3 className="parents-page-highlight">Essentiële cookies</h3>
      <p>Deze cookies zijn nodig om de website goed te laten functioneren. Ze:</p>
      <ul>
        <li>Maken basisnavigatie en gameplay mogelijk</li>
        <li>Onthouden sessie- en beveiligingsinstellingen</li>
        <li>Ondersteunen functies zoals recent gespeelde games</li>
        <li>Kunnen in onze systemen niet worden uitgeschakeld zonder de kernfunctionaliteit te beïnvloeden</li>
      </ul>

      <h3 className="parents-page-highlight">Prestatie- en analytische cookies</h3>
      <p>Deze helpen ons te begrijpen hoe bezoekers de site gebruiken zodat we deze kunnen verbeteren. Ze kunnen:</p>
      <ul>
        <li>Paginabezoeken en gebruikersstromen volgen</li>
        <li>Populariteit van games en sessieduur meten</li>
        <li>Geaggregeerde, anonieme gegevens gebruiken voor interne analyse</li>
      </ul>

      <h3 className="parents-page-highlight">Advertentie- en targetingcookies</h3>
      <p>
        We kunnen cookies gebruiken om leeftijdsgeschikte advertenties te tonen en hun effectiviteit te
        meten. Ze helpen om:
      </p>
      <ul>
        <li>Relevante advertenties te tonen zonder onnodige persoonlijke informatie te volgen</li>
        <li>Naleving van COPPA en AVG te ondersteunen waar van toepassing</li>
      </ul>

      <h3 className="parents-page-highlight">Cookies van derden</h3>
      <p>
        Sommige games kunnen inhoud van externe partners insluiten (bijvoorbeeld HTML5-games die elders
        worden gehost). Deze partners kunnen cookies plaatsen om de game-ervaring te leveren of
        game-interacties te volgen. We beoordelen content van derden op veiligheid en naleving waar
        mogelijk.
      </p>

      <h2>3. Cookies beheren</h2>
      <p>Je kunt cookies op elk moment beheren of uitschakelen door:</p>
      <ul>
        <li>Je browserinstellingen aan te passen om cookies te blokkeren of te verwijderen</li>
        <li>Privacy- of trackingextensies te gebruiken</li>
        <li>Je af te melden voor gepersonaliseerde advertenties via branche-opt-outtools waar beschikbaar</li>
      </ul>
      <p>
        <strong className="parents-page-highlight">Let op:</strong> Het uitschakelen van sommige
        cookies kan gameplay, inlogsessies of sitefuncties zoals het onthouden van recent gespeelde
        games beïnvloeden.
      </p>

      <h2>4. Toestemming voor cookies</h2>
      <p>
        Bij je eerste bezoek aan {SITE_NAME} kun je een cookietoestemmingsmelding zien. Door de site te
        blijven gebruiken of cookies te accepteren wanneer gevraagd, ga je akkoord met het gebruik van
        cookies zoals beschreven in deze verklaring en ons{" "}
        <Link href="/privacy-policy">Privacybeleid</Link>.
      </p>
      <p>
        Als je geen toestemming geeft, worden alleen essentiële cookies gebruikt en werken sommige
        functies (zoals het opslaan van gamevoortgang of gepersonaliseerde advertenties) mogelijk niet
        volledig.
      </p>

      <h2>5. Onze toewijding aan privacy</h2>
      <p>
        We verzamelen niet bewust persoonlijke informatie van kinderen zonder ouderlijke toestemming. We
        streven naar naleving van:
      </p>
      <ul>
        <li>AVG (Europese Unie)</li>
        <li>ePrivacyrichtlijn</li>
        <li>COPPA (Children&apos;s Online Privacy Protection Act, VS)</li>
      </ul>
      <p>
        Gegevens verzameld via cookies worden waar mogelijk anoniem of geaggregeerd gebruikt en worden
        niet aan derden verkocht.
      </p>

      <h2>6. Contact</h2>
      <p>Vragen over ons cookiebeleid of wijzigingen aanvragen? Neem contact op:</p>
      <p>
        {SITE_NAME}
        <br />
        📧 E-mail: <Link href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</Link>
        <br />
        🌐 Website: <Link href={SITE_URL}>{SITE_URL}</Link>
      </p>
      <p>
        {SITE_NAME} — browsergaming veilig, leuk en respectvol voor je privacy maken.
      </p>
    </>
  );
}

export function getCookieStatementContent(locale: LocaleCode): ReactNode {
  switch (locale) {
    case "es":
      return cookieStatementEs();
    case "fr":
      return cookieStatementFr();
    case "nl":
      return cookieStatementNl();
    default:
      return cookieStatementEn();
  }
}
