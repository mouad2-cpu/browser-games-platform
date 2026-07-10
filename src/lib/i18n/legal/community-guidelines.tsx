import type { ReactNode } from "react";
import Link from "next/link";
import type { LocaleCode } from "@/lib/locale";
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/lib/site-config";

function communityGuidelinesEn(): ReactNode {
  return (
    <>
      <p>Last Updated: June 2026</p>

      <h2>Welcome to the Community</h2>
      <p>
        {SITE_NAME} is built to be a fun place to discover games, share high scores, and connect with
        other players. To keep our platform a competitive and welcoming space for all gamers, we ask
        everyone to follow a few simple ground rules.
      </p>
      <p>
        By using community features on {SITE_NAME} — including chat, comments, or other interactive
        areas — you agree to play by these rules.
      </p>

      <h2>1. Keep it Clean (Zero Tolerance for Toxicity)</h2>
      <p>
        Playful trash talk is part of gaming, but hate speech, racism, sexism, harassment, and extreme
        toxicity are not.
      </p>
      <ul>
        <li>Our automated moderation tools actively monitor community spaces where available.</li>
        <li>Profanity and slurs may be automatically masked or filtered.</li>
        <li>
          Bypassing filters or engaging in severe toxicity may result in an immediate and permanent
          ban from community features.
        </li>
      </ul>

      <h2>2. No Spamming or Self-Promotion</h2>
      <p>
        Don&apos;t flood chat, beg for clicks, or post sketchy external links. To keep conversations
        readable for everyone, rate limits may apply — for example, a maximum of{" "}
        <strong className="parents-page-highlight">5 messages every 10 seconds</strong> in live chat
        areas. If you spam, the system may block your messages.
      </p>

      <h2>3. Privacy &amp; Ephemeral Chat</h2>
      <p>
        Live community spaces are fast-moving — not permanent archives. Where chat is available:
      </p>
      <ul>
        <li>Only a limited number of recent messages may be visible at once.</li>
        <li>
          Chat data may be automatically deleted after a short period to keep things fast and protect
          your privacy.
        </li>
        <li>
          <strong className="parents-page-highlight">Never</strong> post sensitive personal
          information (real names, addresses, phone numbers, or passwords) in community areas.
        </li>
      </ul>

      <h2>4. Interacting with Automated Systems</h2>
      <p>
        Some community areas may include automated helpers or moderators (for example, bots that
        answer questions or enforce safety rules). You can usually identify them by a{" "}
        <strong className="parents-page-highlight">BOT</strong> badge next to their name.
      </p>
      <p>
        Treat them as part of the experience, and feel free to use them for help — but remember they
        are not human moderators and cannot handle every situation.
      </p>

      <h2>5. Admin Enforcement</h2>
      <p>
        {SITE_NAME} administrators and moderators (identified by{" "}
        <strong className="parents-page-highlight">ADMIN</strong> and{" "}
        <strong className="parents-page-highlight">MOD</strong> badges where shown) have the final
        say. They reserve the right to delete messages, pin important announcements, and issue
        temporary or permanent bans at their discretion to keep the community safe.
      </p>
      <p>
        If you believe a moderation action was made in error, contact us at{" "}
        <Link href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</Link> or through our{" "}
        <Link href="/contact">contact page</Link>.
      </p>

      <h2>Related Policies</h2>
      <p>
        These guidelines work alongside our other policies. Please also read our{" "}
        <Link href="/terms-of-service">Terms of Service</Link>,{" "}
        <Link href="/privacy-policy">Privacy Policy</Link>, and{" "}
        <Link href="/information-for-parents">Information for Parents</Link>.
      </p>

      <p className="parents-page-highlight">
        Play hard, chat fair, and we&apos;ll see you on the leaderboards!
      </p>

      <p>
        🌐 <Link href={SITE_URL}>{SITE_URL}</Link>
      </p>
    </>
  );
}

function communityGuidelinesEs(): ReactNode {
  return (
    <>
      <p>Última actualización: junio de 2026</p>

      <h2>Bienvenido a la comunidad</h2>
      <p>
        {SITE_NAME} está pensado para ser un lugar divertido donde descubrir juegos, compartir
        puntuaciones altas y conectar con otros jugadores. Para mantener nuestra plataforma como un
        espacio competitivo y acogedor para todos los gamers, pedimos que todos sigan unas reglas
        básicas.
      </p>
      <p>
        Al usar las funciones comunitarias de {SITE_NAME} — incluidos el chat, los comentarios u
        otras áreas interactivas — aceptas cumplir estas normas.
      </p>

      <h2>1. Mantén un ambiente limpio (tolerancia cero ante la toxicidad)</h2>
      <p>
        Las bromas de juego forman parte del gaming, pero el discurso de odio, el racismo, el sexismo,
        el acoso y la toxicidad extrema no tienen cabida.
      </p>
      <ul>
        <li>
          Nuestras herramientas de moderación automatizada supervisan activamente los espacios
          comunitarios cuando están disponibles.
        </li>
        <li>Las palabrotas y los insultos pueden enmascararse o filtrarse automáticamente.</li>
        <li>
          Eludir los filtros o participar en toxicidad grave puede suponer una prohibición inmediata
          y permanente de las funciones comunitarias.
        </li>
      </ul>

      <h2>2. Sin spam ni autopromoción</h2>
      <p>
        No satures el chat, pidas clics ni publiques enlaces externos sospechosos. Para que las
        conversaciones sean legibles para todos, pueden aplicarse límites de frecuencia — por ejemplo,
        un máximo de{" "}
        <strong className="parents-page-highlight">5 mensajes cada 10 segundos</strong> en las
        áreas de chat en vivo. Si haces spam, el sistema puede bloquear tus mensajes.
      </p>

      <h2>3. Privacidad y chat efímero</h2>
      <p>
        Los espacios comunitarios en vivo son dinámicos — no archivos permanentes. Cuando el chat
        esté disponible:
      </p>
      <ul>
        <li>Solo puede mostrarse un número limitado de mensajes recientes a la vez.</li>
        <li>
          Los datos del chat pueden eliminarse automáticamente tras un breve periodo para mantener la
          velocidad y proteger tu privacidad.
        </li>
        <li>
          <strong className="parents-page-highlight">Nunca</strong> publiques información personal
          sensible (nombres reales, direcciones, números de teléfono o contraseñas) en las áreas
          comunitarias.
        </li>
      </ul>

      <h2>4. Interacción con sistemas automatizados</h2>
      <p>
        Algunas áreas comunitarias pueden incluir ayudantes o moderadores automatizados (por ejemplo,
        bots que responden preguntas o aplican reglas de seguridad). Normalmente puedes
        identificarlos por una insignia{" "}
        <strong className="parents-page-highlight">BOT</strong> junto a su nombre.
      </p>
      <p>
        Trátalos como parte de la experiencia y no dudes en usarlos para obtener ayuda — pero recuerda
        que no son moderadores humanos y no pueden gestionar todas las situaciones.
      </p>

      <h2>5. Aplicación por administradores</h2>
      <p>
        Los administradores y moderadores de {SITE_NAME} (identificados por las insignias{" "}
        <strong className="parents-page-highlight">ADMIN</strong> y{" "}
        <strong className="parents-page-highlight">MOD</strong> cuando se muestren) tienen la última
        palabra. Se reservan el derecho de eliminar mensajes, fijar anuncios importantes y aplicar
        prohibiciones temporales o permanentes a su discreción para mantener la comunidad segura.
      </p>
      <p>
        Si crees que una acción de moderación fue un error, contáctanos en{" "}
        <Link href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</Link> o a través de nuestra{" "}
        <Link href="/contact">página de contacto</Link>.
      </p>

      <h2>Políticas relacionadas</h2>
      <p>
        Estas normas complementan nuestras otras políticas. Lee también nuestros{" "}
        <Link href="/terms-of-service">Términos de servicio</Link>, nuestra{" "}
        <Link href="/privacy-policy">Política de privacidad</Link> y la página de{" "}
        <Link href="/information-for-parents">Información para padres</Link>.
      </p>

      <p className="parents-page-highlight">
        ¡Juega con intensidad, chatea con respeto y nos vemos en las clasificaciones!
      </p>

      <p>
        🌐 <Link href={SITE_URL}>{SITE_URL}</Link>
      </p>
    </>
  );
}

function communityGuidelinesFr(): ReactNode {
  return (
    <>
      <p>Dernière mise à jour : juin 2026</p>

      <h2>Bienvenue dans la communauté</h2>
      <p>
        {SITE_NAME} est conçu pour être un lieu amusant où découvrir des jeux, partager ses meilleurs
        scores et échanger avec d&apos;autres joueurs. Pour garder notre plateforme compétitive et
        accueillante pour tous les gamers, nous demandons à chacun de respecter quelques règles
        simples.
      </p>
      <p>
        En utilisant les fonctionnalités communautaires de {SITE_NAME} — chat, commentaires ou autres
        espaces interactifs — vous acceptez de respecter ces règles.
      </p>

      <h2>1. Gardez un espace sain (tolérance zéro pour la toxicité)</h2>
      <p>
        Les taquineries font partie du jeu, mais les discours haineux, le racisme, le sexisme, le
        harcèlement et la toxicité extrême n&apos;ont pas leur place.
      </p>
      <ul>
        <li>
          Nos outils de modération automatisée surveillent activement les espaces communautaires
          lorsqu&apos;ils sont disponibles.
        </li>
        <li>Les insultes et jurons peuvent être masqués ou filtrés automatiquement.</li>
        <li>
          Contourner les filtres ou adopter un comportement gravement toxique peut entraîner une
          exclusion immédiate et permanente des fonctionnalités communautaires.
        </li>
      </ul>

      <h2>2. Pas de spam ni d&apos;autopromotion</h2>
      <p>
        N&apos;inondez pas le chat, ne mendiez pas de clics et ne publiez pas de liens externes
        douteux. Pour garder les conversations lisibles, des limites de débit peuvent s&apos;appliquer
        — par exemple, un maximum de{" "}
        <strong className="parents-page-highlight">5 messages toutes les 10 secondes</strong> dans
        les chats en direct. En cas de spam, le système peut bloquer vos messages.
      </p>

      <h2>3. Confidentialité et chat éphémère</h2>
      <p>
        Les espaces communautaires en direct évoluent vite — ce ne sont pas des archives permanentes.
        Lorsque le chat est disponible :
      </p>
      <ul>
        <li>Seul un nombre limité de messages récents peut être visible à la fois.</li>
        <li>
          Les données de chat peuvent être supprimées automatiquement après un court délai pour
          préserver la rapidité et protéger votre vie privée.
        </li>
        <li>
          <strong className="parents-page-highlight">Ne publiez jamais</strong> d&apos;informations
          personnelles sensibles (noms réels, adresses, numéros de téléphone ou mots de passe) dans
          les espaces communautaires.
        </li>
      </ul>

      <h2>4. Interaction avec les systèmes automatisés</h2>
      <p>
        Certains espaces communautaires peuvent inclure des assistants ou modérateurs automatisés (par
        exemple, des bots qui répondent aux questions ou appliquent les règles de sécurité). Vous
        pouvez généralement les identifier grâce à un badge{" "}
        <strong className="parents-page-highlight">BOT</strong> à côté de leur nom.
      </p>
      <p>
        Considérez-les comme faisant partie de l&apos;expérience et n&apos;hésitez pas à les utiliser
        pour obtenir de l&apos;aide — mais rappelez-vous qu&apos;ils ne sont pas des modérateurs
        humains et ne peuvent pas gérer toutes les situations.
      </p>

      <h2>5. Application par les administrateurs</h2>
      <p>
        Les administrateurs et modérateurs de {SITE_NAME} (identifiés par les badges{" "}
        <strong className="parents-page-highlight">ADMIN</strong> et{" "}
        <strong className="parents-page-highlight">MOD</strong> lorsqu&apos;ils sont affichés) ont le
        dernier mot. Ils se réservent le droit de supprimer des messages, épingler des annonces
        importantes et prononcer des exclusions temporaires ou permanentes à leur discrétion pour
        protéger la communauté.
      </p>
      <p>
        Si vous pensez qu&apos;une action de modération est une erreur, contactez-nous à{" "}
        <Link href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</Link> ou via notre{" "}
        <Link href="/contact">page de contact</Link>.
      </p>

      <h2>Politiques associées</h2>
      <p>
        Ces règles s&apos;accompagnent de nos autres politiques. Consultez également nos{" "}
        <Link href="/terms-of-service">Conditions d&apos;utilisation</Link>, notre{" "}
        <Link href="/privacy-policy">Politique de confidentialité</Link> et la page{" "}
        <Link href="/information-for-parents">Informations pour les parents</Link>.
      </p>

      <p className="parents-page-highlight">
        Jouez fort, chattez fair-play, et à bientôt sur les classements !
      </p>

      <p>
        🌐 <Link href={SITE_URL}>{SITE_URL}</Link>
      </p>
    </>
  );
}

function communityGuidelinesNl(): ReactNode {
  return (
    <>
      <p>Laatst bijgewerkt: juni 2026</p>

      <h2>Welkom in de community</h2>
      <p>
        {SITE_NAME} is bedoeld als een leuke plek om games te ontdekken, high scores te delen en contact
        te maken met andere spelers. Om ons platform competitief en gastvrij te houden voor alle
        gamers, vragen we iedereen een paar eenvoudige basisregels te volgen.
      </p>
      <p>
        Door communityfuncties op {SITE_NAME} te gebruiken — waaronder chat, reacties of andere
        interactieve ruimtes — ga je akkoord met deze regels.
      </p>

      <h2>1. Houd het netjes (nul tolerantie voor toxiciteit)</h2>
      <p>
        Speelse spot hoort bij gamen, maar haatzaaien, racisme, seksisme, intimidatie en extreme
        toxiciteit zijn niet toegestaan.
      </p>
      <ul>
        <li>
          Onze geautomatiseerde moderatietools houden communityruimtes actief in de gaten waar
          beschikbaar.
        </li>
        <li>Vloeken en scheldwoorden kunnen automatisch worden gemaskeerd of gefilterd.</li>
        <li>
          Filters omzeilen of ernstige toxiciteit kan leiden tot een directe en permanente ban van
          communityfuncties.
        </li>
      </ul>

      <h2>2. Geen spam of zelfpromotie</h2>
      <p>
        Overlaad de chat niet, bedel niet om klikken en plaats geen verdachte externe links. Om
        gesprekken leesbaar te houden, kunnen snelheidslimieten gelden — bijvoorbeeld maximaal{" "}
        <strong className="parents-page-highlight">5 berichten per 10 seconden</strong> in live
        chatruimtes. Bij spam kan het systeem je berichten blokkeren.
      </p>

      <h2>3. Privacy en vergankelijke chat</h2>
      <p>
        Live communityruimtes bewegen snel — het zijn geen permanente archieven. Waar chat beschikbaar
        is:
      </p>
      <ul>
        <li>Is slechts een beperkt aantal recente berichten tegelijk zichtbaar.</li>
        <li>
          Chatgegevens kunnen na korte tijd automatisch worden verwijderd om alles snel te houden en
          je privacy te beschermen.
        </li>
        <li>
          <strong className="parents-page-highlight">Plaats nooit</strong> gevoelige persoonlijke
          informatie (echte namen, adressen, telefoonnummers of wachtwoorden) in communityruimtes.
        </li>
      </ul>

      <h2>4. Omgaan met geautomatiseerde systemen</h2>
      <p>
        Sommige communityruimtes kunnen geautomatiseerde helpers of moderators bevatten (bijvoorbeeld
        bots die vragen beantwoorden of veiligheidsregels handhaven). Je herkent ze meestal aan een{" "}
        <strong className="parents-page-highlight">BOT</strong>-badge naast hun naam.
      </p>
      <p>
        Behandel ze als onderdeel van de ervaring en gebruik ze gerust voor hulp — maar onthoud dat ze
        geen menselijke moderators zijn en niet elke situatie kunnen afhandelen.
      </p>

      <h2>5. Handhaving door beheerders</h2>
      <p>
        Beheerders en moderators van {SITE_NAME} (herkenbaar aan{" "}
        <strong className="parents-page-highlight">ADMIN</strong>- en{" "}
        <strong className="parents-page-highlight">MOD</strong>-badges waar getoond) hebben het
        laatste woord. Zij behouden zich het recht voor berichten te verwijderen, belangrijke
        aankondigingen vast te zetten en tijdelijke of permanente bans uit te delen om de community
        veilig te houden.
      </p>
      <p>
        Als je denkt dat een moderatieactie ten onrechte is genomen, neem contact op via{" "}
        <Link href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</Link> of onze{" "}
        <Link href="/contact">contactpagina</Link>.
      </p>

      <h2>Gerelateerd beleid</h2>
      <p>
        Deze richtlijnen werken samen met ons andere beleid. Lees ook onze{" "}
        <Link href="/terms-of-service">Servicevoorwaarden</Link>, ons{" "}
        <Link href="/privacy-policy">Privacybeleid</Link> en de pagina{" "}
        <Link href="/information-for-parents">Informatie voor ouders</Link>.
      </p>

      <p className="parents-page-highlight">
        Speel hard, chat eerlijk, en tot ziens op de ranglijsten!
      </p>

      <p>
        🌐 <Link href={SITE_URL}>{SITE_URL}</Link>
      </p>
    </>
  );
}

export function getCommunityGuidelinesContent(locale: LocaleCode): ReactNode {
  switch (locale) {
    case "es":
      return communityGuidelinesEs();
    case "fr":
      return communityGuidelinesFr();
    case "nl":
      return communityGuidelinesNl();
    default:
      return communityGuidelinesEn();
  }
}
