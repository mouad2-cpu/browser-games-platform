import type { ReactNode } from "react";
import Link from "next/link";
import type { LocaleCode } from "@/lib/locale";
import { CONTACT_EMAIL, LEGAL_EMAIL, SITE_NAME, SITE_URL } from "@/lib/site-config";

function termsOfServiceEn(): ReactNode {
  return (
    <>
      <p>Last Updated: June 2026</p>
      <p>
        Welcome to {SITE_NAME}! These Terms of Service (&ldquo;Terms&rdquo;) explain how you can use
        our website, games, and related services. By accessing or using {SITE_NAME}, you agree to
        these Terms. Please read them carefully before playing.
      </p>
      <p>If you do not agree, please do not use the site.</p>

      <h2>1. About {SITE_NAME}</h2>
      <p>
        {SITE_NAME} is an online platform offering free browser games. Our goal is to make gaming
        simple, fun, and accessible for everyone — without downloads or installations.
      </p>
      <p>
        All games on our site are playable directly in your web browser and are provided either by{" "}
        {SITE_NAME} or by third-party developers who grant us the right to publish their games.
      </p>

      <h2>2. Acceptance of Terms</h2>
      <p>
        By using {SITE_NAME}, you confirm that you are at least 13 years old, or that you have
        permission from a parent or guardian if you are younger. Parents and guardians are
        responsible for supervising their child&apos;s use of our website.
      </p>
      <p>Your continued use of the site means you agree to:</p>
      <ul>
        <li>These Terms of Service</li>
        <li>
          Our <Link href="/privacy-policy">Privacy Policy</Link>
        </li>
        <li>
          Our <Link href="/cookie-statement">Cookie Statement</Link>
        </li>
        <li>Any additional rules or guidelines displayed within specific games or sections</li>
      </ul>

      <h2>3. Use of the Website</h2>
      <p>You agree to use {SITE_NAME} only for lawful purposes and in a way that does not:</p>
      <ul>
        <li>Violate any local, national, or international law or regulation</li>
        <li>Harm or attempt to harm minors</li>
        <li>Disrupt, damage, or interfere with the proper functioning of the site or its servers</li>
      </ul>
      <p>
        You also agree not to use any automated tools (bots, crawlers, scrapers) to collect data or
        manipulate site functions without our written permission.
      </p>

      <h2>4. Intellectual Property Rights</h2>
      <p>
        All content on {SITE_NAME} — including design, layout, logo, text, and custom code — is
        owned by or licensed to {SITE_NAME} and is protected by copyright and trademark laws.
      </p>
      <p>
        Third-party games remain the property of their respective developers and are published with
        permission. You may not copy, redistribute, or sell any part of this site or its games
        without prior written consent.
      </p>

      <h2>5. Games and Third-Party Content</h2>
      <p>
        {SITE_NAME} hosts a wide variety of games developed both internally and by external
        partners. While we do our best to ensure a safe and enjoyable experience, please note:
      </p>
      <ul>
        <li>Some games are hosted on external servers or provided through iframes.</li>
        <li>Third-party games may have their own terms and privacy policies.</li>
        <li>
          {SITE_NAME} is not responsible for external links or third-party advertisements displayed
          in or around games.
        </li>
      </ul>
      <p>We recommend that parents and users review third-party privacy practices before playing.</p>

      <h2>6. Advertising and Monetization</h2>
      <p>
        {SITE_NAME} is a free platform that may be supported by ads. We work with trusted ad
        partners who comply with COPPA and GDPR standards where applicable. Ads may appear before,
        during, or after gameplay, or in banners and interstitial formats. By using the site, you
        agree that ads may be displayed as part of your experience.
      </p>

      <h2>7. Privacy and Data Protection</h2>
      <p>
        We respect your privacy. Our <Link href="/privacy-policy">Privacy Policy</Link> explains how
        we collect, use, and protect data. Key points:
      </p>
      <ul>
        <li>We do not knowingly collect personal information from children without parental consent.</li>
        <li>Cookies may be used for performance, analytics, and personalization.</li>
        <li>We aim to comply with GDPR (EU) and COPPA (US) where applicable.</li>
      </ul>
      <p>
        If you have questions about data use, contact us at{" "}
        <Link href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</Link>.
      </p>

      <h2>8. Account Registration</h2>
      <p>
        Most of {SITE_NAME}&apos;s content is freely available without an account. If features like
        saving scores or creating profiles require registration, you agree to provide accurate
        information, keep your credentials secure, and notify us immediately of unauthorized use.{" "}
        {SITE_NAME} reserves the right to suspend or delete accounts that violate our policies.
      </p>

      <h2>9. Disclaimer of Warranties</h2>
      <p>
        {SITE_NAME} is provided &ldquo;as is&rdquo; and &ldquo;as available.&rdquo; While we strive
        for a secure, smooth experience, we cannot guarantee that the site will be error-free or
        uninterrupted, that all games will function perfectly on all devices or browsers, or that
        all content will always be accurate or up to date. You use the platform at your own risk.
      </p>

      <h2>10. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, {SITE_NAME} and its team are not liable for any
        damages resulting from use or inability to use the website or its games, errors or
        interruptions, data loss or unauthorized access, or content or actions from third-party
        developers. Your only remedy for dissatisfaction is to stop using the site.
      </p>

      <h2>11. Changes to Terms</h2>
      <p>
        We may update these Terms from time to time to reflect new features, legal requirements, or
        policy updates. Changes will be posted on this page with the &ldquo;Last Updated&rdquo; date.
        Continued use of the website after updates means you accept the revised Terms.
      </p>

      <h2>12. International Use</h2>
      <p>
        {SITE_NAME} can be accessed worldwide, but some games or ads may not be available in every
        region. You are responsible for complying with local laws when accessing or using our site.
      </p>

      <h2>13. Contact Information</h2>
      <p>If you have any questions about these Terms, please contact us:</p>
      <p>
        📧 Email: <Link href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</Link>
        <br />
        🌐 Website: <Link href={SITE_URL}>{SITE_URL}</Link>
      </p>

      <h2>14. Final Words</h2>
      <p>
        At {SITE_NAME}, our mission is to keep browser gaming open, safe, and fun for everyone. We
        respect our players, our developers, and our community — and we thank you for being part of
        it. Play fair. Have fun. Stay curious.
      </p>
    </>
  );
}

function termsOfServiceEs(): ReactNode {
  return (
    <>
      <p>Última actualización: junio de 2026</p>
      <p>
        ¡Bienvenido a {SITE_NAME}! Estos Términos de servicio (&ldquo;Términos&rdquo;) explican cómo
        puedes usar nuestro sitio web, juegos y servicios relacionados. Al acceder o usar {SITE_NAME},
        aceptas estos Términos. Léelos con atención antes de jugar.
      </p>
      <p>Si no estás de acuerdo, no utilices el sitio.</p>

      <h2>1. Acerca de {SITE_NAME}</h2>
      <p>
        {SITE_NAME} es una plataforma en línea que ofrece juegos gratuitos para el navegador. Nuestro
        objetivo es hacer que los juegos sean sencillos, divertidos y accesibles para todos — sin
        descargas ni instalaciones.
      </p>
      <p>
        Todos los juegos de nuestro sitio se pueden jugar directamente en el navegador web y son
        proporcionados por {SITE_NAME} o por desarrolladores externos que nos autorizan a publicar sus
        juegos.
      </p>

      <h2>2. Aceptación de los Términos</h2>
      <p>
        Al usar {SITE_NAME}, confirmas que tienes al menos 13 años, o que cuentas con el permiso de un
        padre, madre o tutor si eres menor. Los padres y tutores son responsables de supervisar el uso
        del sitio por parte de sus hijos.
      </p>
      <p>El uso continuado del sitio implica que aceptas:</p>
      <ul>
        <li>Estos Términos de servicio</li>
        <li>
          Nuestra <Link href="/privacy-policy">Política de privacidad</Link>
        </li>
        <li>
          Nuestra <Link href="/cookie-statement">Declaración de cookies</Link>
        </li>
        <li>Cualquier regla o norma adicional mostrada en juegos o secciones específicas</li>
      </ul>

      <h2>3. Uso del sitio web</h2>
      <p>Aceptas usar {SITE_NAME} solo con fines legales y de forma que no:</p>
      <ul>
        <li>Viole leyes o normativas locales, nacionales o internacionales</li>
        <li>Dañe o intente dañar a menores</li>
        <li>Interrumpa, dañe o interfiera con el funcionamiento del sitio o sus servidores</li>
      </ul>
      <p>
        También aceptas no usar herramientas automatizadas (bots, rastreadores, scrapers) para recopilar
        datos o manipular funciones del sitio sin nuestro permiso por escrito.
      </p>

      <h2>4. Derechos de propiedad intelectual</h2>
      <p>
        Todo el contenido de {SITE_NAME} — incluido diseño, maquetación, logotipo, texto y código
        personalizado — pertenece a {SITE_NAME} o está bajo licencia y está protegido por leyes de
        derechos de autor y marcas.
      </p>
      <p>
        Los juegos de terceros siguen siendo propiedad de sus respectivos desarrolladores y se publican
        con permiso. No puedes copiar, redistribuir ni vender ninguna parte de este sitio o sus juegos
        sin consentimiento previo por escrito.
      </p>

      <h2>5. Juegos y contenido de terceros</h2>
      <p>
        {SITE_NAME} aloja una amplia variedad de juegos desarrollados internamente y por socios
        externos. Aunque hacemos todo lo posible para garantizar una experiencia segura y agradable,
        ten en cuenta:
      </p>
      <ul>
        <li>Algunos juegos se alojan en servidores externos o se ofrecen mediante iframes.</li>
        <li>Los juegos de terceros pueden tener sus propios términos y políticas de privacidad.</li>
        <li>
          {SITE_NAME} no es responsable de enlaces externos ni de anuncios de terceros mostrados en o
          alrededor de los juegos.
        </li>
      </ul>
      <p>
        Recomendamos que padres y usuarios revisen las prácticas de privacidad de terceros antes de
        jugar.
      </p>

      <h2>6. Publicidad y monetización</h2>
      <p>
        {SITE_NAME} es una plataforma gratuita que puede financiarse con anuncios. Trabajamos con
        socios publicitarios de confianza que cumplen con COPPA y GDPR cuando corresponda. Los anuncios
        pueden aparecer antes, durante o después del juego, o en formatos de banner e intersticiales.
        Al usar el sitio, aceptas que los anuncios formen parte de tu experiencia.
      </p>

      <h2>7. Privacidad y protección de datos</h2>
      <p>
        Respetamos tu privacidad. Nuestra <Link href="/privacy-policy">Política de privacidad</Link>{" "}
        explica cómo recopilamos, usamos y protegemos los datos. Puntos clave:
      </p>
      <ul>
        <li>
          No recopilamos a sabiendas información personal de menores sin consentimiento parental.
        </li>
        <li>Las cookies pueden usarse para rendimiento, análisis y personalización.</li>
        <li>Buscamos cumplir con el GDPR (UE) y COPPA (EE. UU.) cuando corresponda.</li>
      </ul>
      <p>
        Si tienes preguntas sobre el uso de datos, contáctanos en{" "}
        <Link href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</Link>.
      </p>

      <h2>8. Registro de cuenta</h2>
      <p>
        La mayor parte del contenido de {SITE_NAME} está disponible sin cuenta. Si funciones como guardar
        puntuaciones o crear perfiles requieren registro, aceptas proporcionar información veraz,
        mantener tus credenciales seguras y notificarnos de inmediato cualquier uso no autorizado.{" "}
        {SITE_NAME} se reserva el derecho de suspender o eliminar cuentas que infrinjan nuestras
        políticas.
      </p>

      <h2>9. Exclusión de garantías</h2>
      <p>
        {SITE_NAME} se ofrece &ldquo;tal cual&rdquo; y &ldquo;según disponibilidad&rdquo;. Aunque
        buscamos una experiencia segura y fluida, no podemos garantizar que el sitio esté libre de
        errores o interrupciones, que todos los juegos funcionen perfectamente en todos los dispositivos
        o navegadores, ni que todo el contenido sea siempre exacto o esté actualizado. Usas la
        plataforma bajo tu propio riesgo.
      </p>

      <h2>10. Limitación de responsabilidad</h2>
      <p>
        En la máxima medida permitida por la ley, {SITE_NAME} y su equipo no son responsables de daños
        derivados del uso o la imposibilidad de usar el sitio o sus juegos, errores o interrupciones,
        pérdida de datos o acceso no autorizado, ni del contenido o acciones de desarrolladores
        externos. Tu único recurso ante la insatisfacción es dejar de usar el sitio.
      </p>

      <h2>11. Cambios en los Términos</h2>
      <p>
        Podemos actualizar estos Términos periódicamente para reflejar nuevas funciones, requisitos
        legales o cambios de política. Los cambios se publicarán en esta página con la fecha de
        &ldquo;Última actualización&rdquo;. El uso continuado del sitio tras las actualizaciones
        implica la aceptación de los Términos revisados.
      </p>

      <h2>12. Uso internacional</h2>
      <p>
        {SITE_NAME} puede accederse en todo el mundo, pero algunos juegos o anuncios pueden no estar
        disponibles en todas las regiones. Eres responsable de cumplir las leyes locales al acceder o
        usar nuestro sitio.
      </p>

      <h2>13. Información de contacto</h2>
      <p>Si tienes preguntas sobre estos Términos, contáctanos:</p>
      <p>
        📧 Correo: <Link href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</Link>
        <br />
        🌐 Sitio web: <Link href={SITE_URL}>{SITE_URL}</Link>
      </p>

      <h2>14. Palabras finales</h2>
      <p>
        En {SITE_NAME}, nuestra misión es mantener los juegos de navegador abiertos, seguros y
        divertidos para todos. Respetamos a nuestros jugadores, desarrolladores y comunidad — y te
        agradecemos formar parte de ella. Juega limpio. Diviértete. Mantén la curiosidad.
      </p>
    </>
  );
}

function termsOfServiceFr(): ReactNode {
  return (
    <>
      <p>Dernière mise à jour : juin 2026</p>
      <p>
        Bienvenue sur {SITE_NAME} ! Ces Conditions d&apos;utilisation (&ldquo;Conditions&rdquo;)
        expliquent comment vous pouvez utiliser notre site web, nos jeux et les services associés. En
        accédant à {SITE_NAME} ou en l&apos;utilisant, vous acceptez ces Conditions. Veuillez les
        lire attentivement avant de jouer.
      </p>
      <p>Si vous n&apos;êtes pas d&apos;accord, veuillez ne pas utiliser le site.</p>

      <h2>1. À propos de {SITE_NAME}</h2>
      <p>
        {SITE_NAME} est une plateforme en ligne proposant des jeux gratuits pour navigateur. Notre
        objectif est de rendre le jeu simple, amusant et accessible à tous — sans téléchargement ni
        installation.
      </p>
      <p>
        Tous les jeux de notre site sont jouables directement dans votre navigateur web et sont fournis
        soit par {SITE_NAME}, soit par des développeurs tiers qui nous autorisent à publier leurs jeux.
      </p>

      <h2>2. Acceptation des Conditions</h2>
      <p>
        En utilisant {SITE_NAME}, vous confirmez avoir au moins 13 ans, ou disposer de l&apos;autorisation
        d&apos;un parent ou tuteur si vous êtes plus jeune. Les parents et tuteurs sont responsables de
        superviser l&apos;utilisation du site par leur enfant.
      </p>
      <p>Votre utilisation continue du site signifie que vous acceptez :</p>
      <ul>
        <li>Ces Conditions d&apos;utilisation</li>
        <li>
          Notre <Link href="/privacy-policy">Politique de confidentialité</Link>
        </li>
        <li>
          Notre <Link href="/cookie-statement">Déclaration sur les cookies</Link>
        </li>
        <li>Toute règle ou directive supplémentaire affichée dans des jeux ou sections spécifiques</li>
      </ul>

      <h2>3. Utilisation du site web</h2>
      <p>Vous acceptez d&apos;utiliser {SITE_NAME} uniquement à des fins légales et de manière à ne pas :</p>
      <ul>
        <li>Violer une loi ou réglementation locale, nationale ou internationale</li>
        <li>Nuire ou tenter de nuire à des mineurs</li>
        <li>Perturber, endommager ou interférer avec le bon fonctionnement du site ou de ses serveurs</li>
      </ul>
      <p>
        Vous acceptez également de ne pas utiliser d&apos;outils automatisés (bots, crawlers, scrapers)
        pour collecter des données ou manipuler les fonctions du site sans notre autorisation écrite.
      </p>

      <h2>4. Droits de propriété intellectuelle</h2>
      <p>
        Tout le contenu de {SITE_NAME} — y compris le design, la mise en page, le logo, le texte et le
        code personnalisé — appartient à {SITE_NAME} ou est sous licence et est protégé par les lois sur
        le droit d&apos;auteur et les marques.
      </p>
      <p>
        Les jeux tiers restent la propriété de leurs développeurs respectifs et sont publiés avec
        autorisation. Vous ne pouvez pas copier, redistribuer ou vendre une partie de ce site ou de
        ses jeux sans consentement écrit préalable.
      </p>

      <h2>5. Jeux et contenu tiers</h2>
      <p>
        {SITE_NAME} héberge une grande variété de jeux développés en interne et par des partenaires
        externes. Bien que nous fassions de notre mieux pour garantir une expérience sûre et agréable,
        veuillez noter :
      </p>
      <ul>
        <li>Certains jeux sont hébergés sur des serveurs externes ou fournis via des iframes.</li>
        <li>Les jeux tiers peuvent avoir leurs propres conditions et politiques de confidentialité.</li>
        <li>
          {SITE_NAME} n&apos;est pas responsable des liens externes ni des publicités tierces affichées
          dans ou autour des jeux.
        </li>
      </ul>
      <p>
        Nous recommandons aux parents et utilisateurs de consulter les pratiques de confidentialité des
        tiers avant de jouer.
      </p>

      <h2>6. Publicité et monétisation</h2>
      <p>
        {SITE_NAME} est une plateforme gratuite qui peut être financée par la publicité. Nous travaillons
        avec des partenaires publicitaires de confiance conformes aux normes COPPA et RGPD le cas
        échéant. Des publicités peuvent apparaître avant, pendant ou après le jeu, ou sous forme de
        bannières et d&apos;interstitiels. En utilisant le site, vous acceptez que des publicités
        puissent faire partie de votre expérience.
      </p>

      <h2>7. Confidentialité et protection des données</h2>
      <p>
        Nous respectons votre vie privée. Notre{" "}
        <Link href="/privacy-policy">Politique de confidentialité</Link> explique comment nous
        collectons, utilisons et protégeons les données. Points clés :
      </p>
      <ul>
        <li>
          Nous ne collectons pas sciemment d&apos;informations personnelles d&apos;enfants sans
          consentement parental.
        </li>
        <li>Les cookies peuvent être utilisés pour les performances, l&apos;analyse et la personnalisation.</li>
        <li>Nous visons la conformité au RGPD (UE) et à la COPPA (États-Unis) le cas échéant.</li>
      </ul>
      <p>
        Pour toute question sur l&apos;utilisation des données, contactez-nous à{" "}
        <Link href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</Link>.
      </p>

      <h2>8. Création de compte</h2>
      <p>
        La plupart du contenu de {SITE_NAME} est accessible sans compte. Si des fonctionnalités comme
        l&apos;enregistrement des scores ou la création de profils nécessitent une inscription, vous
        acceptez de fournir des informations exactes, de garder vos identifiants sécurisés et de nous
        informer immédiatement de toute utilisation non autorisée. {SITE_NAME} se réserve le droit de
        suspendre ou supprimer les comptes qui enfreignent nos politiques.
      </p>

      <h2>9. Exclusion de garanties</h2>
      <p>
        {SITE_NAME} est fourni &ldquo;tel quel&rdquo; et &ldquo;selon disponibilité&rdquo;. Bien que
        nous visons une expérience sécurisée et fluide, nous ne pouvons garantir que le site sera sans
        erreur ou ininterrompu, que tous les jeux fonctionneront parfaitement sur tous les appareils ou
        navigateurs, ni que tout le contenu sera toujours exact ou à jour. Vous utilisez la plateforme
        à vos propres risques.
      </p>

      <h2>10. Limitation de responsabilité</h2>
      <p>
        Dans la mesure maximale permise par la loi, {SITE_NAME} et son équipe ne sont pas responsables
        des dommages résultant de l&apos;utilisation ou de l&apos;impossibilité d&apos;utiliser le site
        ou ses jeux, des erreurs ou interruptions, de la perte de données ou d&apos;un accès non
        autorisé, ni du contenu ou des actions de développeurs tiers. Votre seul recours en cas
        d&apos;insatisfaction est de cesser d&apos;utiliser le site.
      </p>

      <h2>11. Modifications des Conditions</h2>
      <p>
        Nous pouvons mettre à jour ces Conditions de temps à autre pour refléter de nouvelles
        fonctionnalités, des exigences légales ou des mises à jour de politique. Les modifications
        seront publiées sur cette page avec la date de &ldquo;Dernière mise à jour&rdquo;. L&apos;utilisation
        continue du site après les mises à jour signifie que vous acceptez les Conditions révisées.
      </p>

      <h2>12. Utilisation internationale</h2>
      <p>
        {SITE_NAME} est accessible dans le monde entier, mais certains jeux ou publicités peuvent ne pas
        être disponibles dans toutes les régions. Vous êtes responsable du respect des lois locales
        lors de l&apos;accès ou de l&apos;utilisation de notre site.
      </p>

      <h2>13. Coordonnées</h2>
      <p>Si vous avez des questions sur ces Conditions, contactez-nous :</p>
      <p>
        📧 E-mail : <Link href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</Link>
        <br />
        🌐 Site web : <Link href={SITE_URL}>{SITE_URL}</Link>
      </p>

      <h2>14. Mot de la fin</h2>
      <p>
        Chez {SITE_NAME}, notre mission est de garder le jeu navigateur ouvert, sûr et amusant pour
        tous. Nous respectons nos joueurs, nos développeurs et notre communauté — et nous vous remercions
        d&apos;en faire partie. Jouez fair-play. Amusez-vous. Restez curieux.
      </p>
    </>
  );
}

function termsOfServiceNl(): ReactNode {
  return (
    <>
      <p>Laatst bijgewerkt: juni 2026</p>
      <p>
        Welkom bij {SITE_NAME}! Deze Servicevoorwaarden (&ldquo;Voorwaarden&rdquo;) leggen uit hoe je
        onze website, games en gerelateerde diensten mag gebruiken. Door {SITE_NAME} te bezoeken of te
        gebruiken, ga je akkoord met deze Voorwaarden. Lees ze zorgvuldig door voordat je speelt.
      </p>
      <p>Als je het niet eens bent, gebruik de site dan niet.</p>

      <h2>1. Over {SITE_NAME}</h2>
      <p>
        {SITE_NAME} is een online platform met gratis browsergames. Ons doel is gamen eenvoudig, leuk en
        toegankelijk te maken voor iedereen — zonder downloads of installaties.
      </p>
      <p>
        Alle games op onze site zijn direct speelbaar in je webbrowser en worden aangeboden door{" "}
        {SITE_NAME} of door externe ontwikkelaars die ons toestemming geven hun games te publiceren.
      </p>

      <h2>2. Aanvaarding van de Voorwaarden</h2>
      <p>
        Door {SITE_NAME} te gebruiken, bevestig je dat je minstens 13 jaar bent, of toestemming hebt
        van een ouder of voogd als je jonger bent. Ouders en voogden zijn verantwoordelijk voor het
        toezicht op het gebruik van onze website door hun kind.
      </p>
      <p>Voortgezet gebruik van de site betekent dat je akkoord gaat met:</p>
      <ul>
        <li>Deze Servicevoorwaarden</li>
        <li>
          Ons <Link href="/privacy-policy">Privacybeleid</Link>
        </li>
        <li>
          Onze <Link href="/cookie-statement">Cookieverklaring</Link>
        </li>
        <li>Eventuele aanvullende regels of richtlijnen in specifieke games of secties</li>
      </ul>

      <h2>3. Gebruik van de website</h2>
      <p>Je stemt ermee in {SITE_NAME} alleen voor wettige doeleinden te gebruiken en op een manier die niet:</p>
      <ul>
        <li>Lokale, nationale of internationale wet- of regelgeving schendt</li>
        <li>Minderjarigen schaadt of probeert te schaden</li>
        <li>De werking van de site of servers verstoort, beschadigt of belemmert</li>
      </ul>
      <p>
        Je stemt er ook mee in geen geautomatiseerde tools (bots, crawlers, scrapers) te gebruiken om
        gegevens te verzamelen of sitefuncties te manipuleren zonder onze schriftelijke toestemming.
      </p>

      <h2>4. Intellectuele eigendomsrechten</h2>
      <p>
        Alle inhoud op {SITE_NAME} — inclusief ontwerp, lay-out, logo, tekst en aangepaste code — is
        eigendom van of in licentie bij {SITE_NAME} en wordt beschermd door auteurs- en merkenrecht.
      </p>
      <p>
        Games van derden blijven eigendom van hun respectievelijke ontwikkelaars en worden met
        toestemming gepubliceerd. Je mag geen deel van deze site of de games kopiëren, herdistribueren
        of verkopen zonder voorafgaande schriftelijke toestemming.
      </p>

      <h2>5. Games en content van derden</h2>
      <p>
        {SITE_NAME} host een breed scala aan games die intern en door externe partners zijn ontwikkeld.
        Hoewel we ons best doen voor een veilige en plezierige ervaring, let op:
      </p>
      <ul>
        <li>Sommige games worden gehost op externe servers of aangeboden via iframes.</li>
        <li>Games van derden kunnen eigen voorwaarden en privacybeleid hebben.</li>
        <li>
          {SITE_NAME} is niet verantwoordelijk voor externe links of advertenties van derden in of rond
          games.
        </li>
      </ul>
      <p>
        We raden ouders en gebruikers aan privacypraktijken van derden te bekijken voordat ze spelen.
      </p>

      <h2>6. Reclame en monetisatie</h2>
      <p>
        {SITE_NAME} is een gratis platform dat mogelijk wordt ondersteund door advertenties. We werken
        samen met betrouwbare advertentiepartners die waar van toepassing voldoen aan COPPA en AVG.
        Advertenties kunnen voor, tijdens of na het spelen verschijnen, of als banners en interstitials.
        Door de site te gebruiken, ga je akkoord dat advertenties deel uitmaken van je ervaring.
      </p>

      <h2>7. Privacy en gegevensbescherming</h2>
      <p>
        We respecteren je privacy. Ons <Link href="/privacy-policy">Privacybeleid</Link> legt uit hoe we
        gegevens verzamelen, gebruiken en beschermen. Belangrijke punten:
      </p>
      <ul>
        <li>We verzamelen niet bewust persoonsgegevens van kinderen zonder ouderlijke toestemming.</li>
        <li>Cookies kunnen worden gebruikt voor prestaties, analyse en personalisatie.</li>
        <li>We streven naar naleving van de AVG (EU) en COPPA (VS) waar van toepassing.</li>
      </ul>
      <p>
        Vragen over gegevensgebruik? Neem contact op via{" "}
        <Link href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</Link>.
      </p>

      <h2>8. Accountregistratie</h2>
      <p>
        Het meeste van {SITE_NAME} is vrij toegankelijk zonder account. Als functies zoals scores
        opslaan of profielen aanmaken registratie vereisen, ga je akkoord met het verstrekken van
        juiste informatie, het beveiligen van je inloggegevens en het onmiddellijk melden van
        ongeautoriseerd gebruik. {SITE_NAME} behoudt zich het recht voor accounts die ons beleid
        schenden op te schorten of te verwijderen.
      </p>

      <h2>9. Uitsluiting van garanties</h2>
      <p>
        {SITE_NAME} wordt geleverd &ldquo;as is&rdquo; en &ldquo;zoals beschikbaar&rdquo;. Hoewel we
        streven naar een veilige, soepele ervaring, kunnen we niet garanderen dat de site foutloos of
        ononderbroken is, dat alle games perfect werken op alle apparaten of browsers, of dat alle
        inhoud altijd accuraat of actueel is. Je gebruikt het platform op eigen risico.
      </p>

      <h2>10. Beperking van aansprakelijkheid</h2>
      <p>
        Voor zover wettelijk toegestaan zijn {SITE_NAME} en het team niet aansprakelijk voor schade
        door gebruik of het onvermogen de website of games te gebruiken, fouten of onderbrekingen,
        gegevensverlies of ongeautoriseerde toegang, of content of handelingen van externe
        ontwikkelaars. Je enige remedie bij ontevredenheid is stoppen met het gebruik van de site.
      </p>

      <h2>11. Wijzigingen in de Voorwaarden</h2>
      <p>
        We kunnen deze Voorwaarden van tijd tot tijd bijwerken voor nieuwe functies, wettelijke
        vereisten of beleidswijzigingen. Wijzigingen worden op deze pagina geplaatst met de datum
        &ldquo;Laatst bijgewerkt&rdquo;. Voortgezet gebruik na updates betekent dat je de herziene
        Voorwaarden accepteert.
      </p>

      <h2>12. Internationaal gebruik</h2>
      <p>
        {SITE_NAME} is wereldwijd toegankelijk, maar sommige games of advertenties zijn mogelijk niet
        in elke regio beschikbaar. Je bent zelf verantwoordelijk voor naleving van lokale wetten bij
        het bezoeken of gebruiken van onze site.
      </p>

      <h2>13. Contactgegevens</h2>
      <p>Vragen over deze Voorwaarden? Neem contact op:</p>
      <p>
        📧 E-mail: <Link href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</Link>
        <br />
        🌐 Website: <Link href={SITE_URL}>{SITE_URL}</Link>
      </p>

      <h2>14. Slotwoord</h2>
      <p>
        Bij {SITE_NAME} is onze missie browsergaming open, veilig en leuk te houden voor iedereen. We
        respecteren onze spelers, ontwikkelaars en community — en bedanken je dat je er deel van
        uitmaakt. Speel eerlijk. Heb plezier. Blijf nieuwsgierig.
      </p>
    </>
  );
}

export function getTermsOfServiceContent(locale: LocaleCode): ReactNode {
  switch (locale) {
    case "es":
      return termsOfServiceEs();
    case "fr":
      return termsOfServiceFr();
    case "nl":
      return termsOfServiceNl();
    default:
      return termsOfServiceEn();
  }
}
