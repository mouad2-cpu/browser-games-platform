import type { ReactNode } from "react";
import Link from "next/link";
import type { LocaleCode } from "@/lib/locale";
import { CONTACT_EMAIL, LEGAL_EMAIL, SITE_NAME, SITE_URL } from "@/lib/site-config";

function dmcaPageEn(): ReactNode {
  return (
    <>
      <p>Last Updated: June 2026</p>
      <p>
        At {SITE_NAME}, we respect the intellectual property rights of others and expect our users,
        partners, and content providers to do the same. This Digital Millennium Copyright Act
        (&ldquo;DMCA&rdquo;) Notice explains how we handle copyright complaints and how you can
        contact us to report alleged copyright infringement.
      </p>

      <h2>1. Our Policy</h2>
      <p>
        {SITE_NAME} follows the provisions of the DMCA (17 U.S.C. §512) and promptly responds to
        valid notices of alleged infringement.
      </p>
      <p>
        We take copyright concerns seriously and will remove or disable access to infringing content
        when properly notified in accordance with the law.
      </p>
      <p>
        If you believe that any content on our website (including games, images, or videos) infringes
        your copyright, please follow the steps below to submit a formal DMCA Takedown Notice.
      </p>

      <h2>2. How to Submit a DMCA Takedown Notice</h2>
      <p>
        To file a notice of claimed infringement, please send a written communication that includes
        the following information:
      </p>
      <ol>
        <li>
          Your full legal name and contact information (email address, phone number, and mailing
          address).
        </li>
        <li>A clear description of the copyrighted work you believe has been infringed.</li>
        <li>
          A specific link (URL) or sufficient information to identify the allegedly infringing
          material on {SITE_NAME}.
        </li>
        <li>
          A statement that you have a good faith belief that the disputed use is not authorized by
          the copyright owner, its agent, or the law.
        </li>
        <li>
          A statement that the information in your notice is accurate, and under penalty of perjury,
          that you are the owner (or authorized to act on behalf of the owner) of the copyright that
          is allegedly infringed.
        </li>
        <li>Your physical or electronic signature.</li>
      </ol>
      <p>You can submit your DMCA notice via email to:</p>
      <p>
        📧 <Link href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</Link>
      </p>

      <h2>3. Counter-Notification</h2>
      <p>
        If your content has been removed or disabled by mistake or misidentification, you may submit a
        counter-notification.
      </p>
      <p>Your counter-notice must include:</p>
      <ol>
        <li>Your full name, address, telephone number, and email address.</li>
        <li>
          Identification of the material that has been removed or disabled and the location where it
          appeared before removal.
        </li>
        <li>
          A statement under penalty of perjury that you have a good faith belief the material was
          removed or disabled due to a mistake or misidentification.
        </li>
        <li>
          A statement that you consent to the jurisdiction of the courts in your area and that you
          will accept service of process from the person who submitted the original DMCA notice.
        </li>
        <li>Your physical or electronic signature.</li>
      </ol>
      <p>Counter-notices should also be sent to:</p>
      <p>
        📧 <Link href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</Link>
      </p>

      <h2>4. Repeat Infringer Policy</h2>
      <p>
        In accordance with the DMCA and other applicable laws, {SITE_NAME} reserves the right to
        terminate or suspend user accounts and remove content belonging to repeat infringers.
      </p>
      <p>
        We may also restrict access to certain features or services if we receive multiple valid
        complaints related to the same user or publisher.
      </p>

      <h2>5. External Game Content</h2>
      <p>
        Some games hosted or embedded on {SITE_NAME} originate from third-party developers or
        external sources.
      </p>
      <p>
        If the allegedly infringing material is part of an externally hosted game, please note that{" "}
        {SITE_NAME} may not control the original content. However, we will forward your complaint to
        the responsible party or take necessary steps to restrict access on our platform.
      </p>

      <h2>6. Good Faith and Misuse of DMCA</h2>
      <p>Submitting false or misleading DMCA notices can result in legal consequences.</p>
      <p>
        Please ensure that your claim is valid and based on a genuine belief of infringement before
        submitting a notice.
      </p>

      <h2>7. Contact Information</h2>
      <p>
        If you have questions or need clarification before submitting a DMCA notice, please contact
        us at:
      </p>
      <p>{SITE_NAME} Legal Department</p>
      <ul>
        <li>
          📧 Email: <Link href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</Link>
        </li>
        <li>
          🌐 Website: <Link href={SITE_URL}>{SITE_URL}</Link>
        </li>
      </ul>
      <p>
        For general support, you can also reach us at{" "}
        <Link href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</Link> or through our{" "}
        <Link href="/contact">contact form</Link>.
      </p>

      <h2>8. Final Note</h2>
      <p>We strive to maintain a safe, creative, and fair gaming environment for everyone.</p>
      <p>
        If you&apos;re a developer or artist who believes your work has been used without
        permission, please reach out — we&apos;ll handle your request with care and respect.
      </p>
    </>
  );
}

function dmcaPageEs(): ReactNode {
  return (
    <>
      <p>Última actualización: junio de 2026</p>
      <p>
        En {SITE_NAME}, respetamos los derechos de propiedad intelectual de terceros y esperamos que
        nuestros usuarios, socios y proveedores de contenido hagan lo mismo. Este Aviso de la Ley de
        Derechos de Autor del Milenio Digital (&ldquo;DMCA&rdquo;) explica cómo gestionamos las
        reclamaciones por derechos de autor y cómo puede contactarnos para denunciar una supuesta
        infracción.
      </p>

      <h2>1. Nuestra política</h2>
      <p>
        {SITE_NAME} cumple las disposiciones de la DMCA (17 U.S.C. §512) y responde con prontitud a
        las notificaciones válidas de supuesta infracción.
      </p>
      <p>
        Nos tomamos en serio las cuestiones de derechos de autor y eliminaremos o deshabilitaremos el
        acceso al contenido infractor cuando recibamos una notificación adecuada conforme a la ley.
      </p>
      <p>
        Si cree que algún contenido de nuestro sitio web (incluidos juegos, imágenes o vídeos)
        infringe sus derechos de autor, siga los pasos que se indican a continuación para enviar una
        Notificación formal de retirada DMCA.
      </p>

      <h2>2. Cómo enviar una Notificación de retirada DMCA</h2>
      <p>
        Para presentar una notificación de infracción reclamada, envíe una comunicación escrita que
        incluya la siguiente información:
      </p>
      <ol>
        <li>
          Su nombre legal completo y datos de contacto (correo electrónico, número de teléfono y
          dirección postal).
        </li>
        <li>Una descripción clara de la obra protegida por derechos de autor que considera infringida.</li>
        <li>
          Un enlace (URL) específico o información suficiente para identificar el material supuestamente
          infractor en {SITE_NAME}.
        </li>
        <li>
          Una declaración de que cree de buena fe que el uso disputado no está autorizado por el
          titular de los derechos, su agente o la ley.
        </li>
        <li>
          Una declaración de que la información de su notificación es exacta y, bajo pena de
          perjurio, de que es el titular (o está autorizado para actuar en nombre del titular) de los
          derechos de autor supuestamente infringidos.
        </li>
        <li>Su firma física o electrónica.</li>
      </ol>
      <p>Puede enviar su notificación DMCA por correo electrónico a:</p>
      <p>
        📧 <Link href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</Link>
      </p>

      <h2>3. Contra-notificación</h2>
      <p>
        Si su contenido ha sido eliminado o deshabilitado por error o identificación incorrecta,
        puede presentar una contra-notificación.
      </p>
      <p>Su contra-notificación debe incluir:</p>
      <ol>
        <li>Su nombre completo, dirección, número de teléfono y correo electrónico.</li>
        <li>
          Identificación del material eliminado o deshabilitado y la ubicación en la que aparecía
          antes de su retirada.
        </li>
        <li>
          Una declaración bajo pena de perjurio de que cree de buena fe que el material fue eliminado
          o deshabilitado por error o identificación incorrecta.
        </li>
        <li>
          Una declaración de que acepta la jurisdicción de los tribunales de su zona y que aceptará
          la notificación del proceso de la persona que presentó la notificación DMCA original.
        </li>
        <li>Su firma física o electrónica.</li>
      </ol>
      <p>Las contra-notificaciones también deben enviarse a:</p>
      <p>
        📧 <Link href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</Link>
      </p>

      <h2>4. Política de infractores reincidentes</h2>
      <p>
        De conformidad con la DMCA y otras leyes aplicables, {SITE_NAME} se reserva el derecho de
        cancelar o suspender cuentas de usuario y eliminar contenido perteneciente a infractores
        reincidentes.
      </p>
      <p>
        También podemos restringir el acceso a determinadas funciones o servicios si recibimos
        múltiples reclamaciones válidas relacionadas con el mismo usuario o editor.
      </p>

      <h2>5. Contenido de juegos externos</h2>
      <p>
        Algunos juegos alojados o integrados en {SITE_NAME} proceden de desarrolladores externos u
        otras fuentes.
      </p>
      <p>
        Si el material supuestamente infractor forma parte de un juego alojado externamente, tenga en
        cuenta que {SITE_NAME} puede no controlar el contenido original. No obstante, reenviaremos su
        reclamación a la parte responsable o tomaremos las medidas necesarias para restringir el
        acceso en nuestra plataforma.
      </p>

      <h2>6. Buena fe y uso indebido de la DMCA</h2>
      <p>Enviar notificaciones DMCA falsas o engañosas puede tener consecuencias legales.</p>
      <p>
        Asegúrese de que su reclamación sea válida y esté basada en una creencia genuina de
        infracción antes de enviar una notificación.
      </p>

      <h2>7. Información de contacto</h2>
      <p>
        Si tiene preguntas o necesita aclaraciones antes de enviar una notificación DMCA, contáctenos
        en:
      </p>
      <p>Departamento Legal de {SITE_NAME}</p>
      <ul>
        <li>
          📧 Correo electrónico: <Link href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</Link>
        </li>
        <li>
          🌐 Sitio web: <Link href={SITE_URL}>{SITE_URL}</Link>
        </li>
      </ul>
      <p>
        Para asistencia general, también puede escribirnos a{" "}
        <Link href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</Link> o a través de nuestro{" "}
        <Link href="/contact">formulario de contacto</Link>.
      </p>

      <h2>8. Nota final</h2>
      <p>Nos esforzamos por mantener un entorno de juego seguro, creativo y justo para todos.</p>
      <p>
        Si es desarrollador o artista y cree que su obra se ha utilizado sin permiso, póngase en
        contacto con nosotros: trataremos su solicitud con cuidado y respeto.
      </p>
    </>
  );
}

function dmcaPageFr(): ReactNode {
  return (
    <>
      <p>Dernière mise à jour : juin 2026</p>
      <p>
        Chez {SITE_NAME}, nous respectons les droits de propriété intellectuelle d&apos;autrui et
        attendons de nos utilisateurs, partenaires et fournisseurs de contenu qu&apos;ils fassent de
        même. Le présent Avis relatif au Digital Millennium Copyright Act (&ldquo;DMCA&rdquo;)
        explique comment nous traitons les réclamations pour violation du droit d&apos;auteur et
        comment nous contacter pour signaler une prétendue contrefaçon.
      </p>

      <h2>1. Notre politique</h2>
      <p>
        {SITE_NAME} respecte les dispositions du DMCA (17 U.S.C. §512) et répond rapidement aux
        notifications valides de prétendue violation.
      </p>
      <p>
        Nous prenons les questions de droit d&apos;auteur au sérieux et supprimerons ou
        désactiverons l&apos;accès au contenu contrefaisant lorsque nous sommes dûment informés
        conformément à la loi.
      </p>
      <p>
        Si vous pensez qu&apos;un contenu de notre site web (y compris des jeux, images ou vidéos)
        porte atteinte à vos droits d&apos;auteur, veuillez suivre les étapes ci-dessous pour
        soumettre une Notification formelle de retrait DMCA.
      </p>

      <h2>2. Comment soumettre une Notification de retrait DMCA</h2>
      <p>
        Pour déposer une notification de violation alléguée, veuillez envoyer une communication
        écrite comprenant les informations suivantes :
      </p>
      <ol>
        <li>
          Votre nom légal complet et vos coordonnées (adresse e-mail, numéro de téléphone et adresse
          postale).
        </li>
        <li>
          Une description claire de l&apos;œuvre protégée par le droit d&apos;auteur que vous estimez
          contrefaite.
        </li>
        <li>
          Un lien (URL) précis ou des informations suffisantes pour identifier le matériel
          prétendument contrefaisant sur {SITE_NAME}.
        </li>
        <li>
          Une déclaration attestant que vous croyez de bonne foi que l&apos;utilisation contestée
          n&apos;est pas autorisée par le titulaire du droit d&apos;auteur, son mandataire ou la loi.
        </li>
        <li>
          Une déclaration attestant que les informations contenues dans votre notification sont
          exactes et, sous peine de parjure, que vous êtes le titulaire (ou autorisé à agir au nom du
          titulaire) du droit d&apos;auteur prétendument violé.
        </li>
        <li>Votre signature physique ou électronique.</li>
      </ol>
      <p>Vous pouvez envoyer votre notification DMCA par e-mail à :</p>
      <p>
        📧 <Link href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</Link>
      </p>

      <h2>3. Contre-notification</h2>
      <p>
        Si votre contenu a été supprimé ou désactivé par erreur ou mauvaise identification, vous
        pouvez soumettre une contre-notification.
      </p>
      <p>Votre contre-notification doit inclure :</p>
      <ol>
        <li>Votre nom complet, adresse, numéro de téléphone et adresse e-mail.</li>
        <li>
          L&apos;identification du matériel supprimé ou désactivé et l&apos;emplacement où il
          apparaissait avant sa suppression.
        </li>
        <li>
          Une déclaration sous peine de parjure attestant que vous croyez de bonne foi que le
          matériel a été supprimé ou désactivé par erreur ou mauvaise identification.
        </li>
        <li>
          Une déclaration attestant que vous consentez à la juridiction des tribunaux de votre région
          et que vous accepterez la signification de la procédure de la personne ayant soumis la
          notification DMCA initiale.
        </li>
        <li>Votre signature physique ou électronique.</li>
      </ol>
      <p>Les contre-notifications doivent également être envoyées à :</p>
      <p>
        📧 <Link href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</Link>
      </p>

      <h2>4. Politique relative aux contrevenants récidivistes</h2>
      <p>
        Conformément au DMCA et aux autres lois applicables, {SITE_NAME} se réserve le droit de
        résilier ou suspendre les comptes utilisateurs et de supprimer le contenu appartenant aux
        contrevenants récidivistes.
      </p>
      <p>
        Nous pouvons également restreindre l&apos;accès à certaines fonctionnalités ou services si
        nous recevons plusieurs plaintes valides concernant le même utilisateur ou éditeur.
      </p>

      <h2>5. Contenu de jeux externes</h2>
      <p>
        Certains jeux hébergés ou intégrés sur {SITE_NAME} proviennent de développeurs tiers ou de
        sources externes.
      </p>
      <p>
        Si le matériel prétendument contrefaisant fait partie d&apos;un jeu hébergé en externe,
        veuillez noter que {SITE_NAME} peut ne pas contrôler le contenu original. Cependant, nous
        transmettrons votre plainte à la partie responsable ou prendrons les mesures nécessaires pour
        restreindre l&apos;accès sur notre plateforme.
      </p>

      <h2>6. Bonne foi et abus du DMCA</h2>
      <p>Soumettre de fausses notifications DMCA ou des notifications trompeuses peut avoir des conséquences juridiques.</p>
      <p>
        Veuillez vous assurer que votre réclamation est valide et fondée sur une conviction sincère
        d&apos;une violation avant de soumettre une notification.
      </p>

      <h2>7. Coordonnées</h2>
      <p>
        Si vous avez des questions ou besoin de précisions avant de soumettre une notification DMCA,
        veuillez nous contacter à :
      </p>
      <p>Service juridique de {SITE_NAME}</p>
      <ul>
        <li>
          📧 E-mail : <Link href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</Link>
        </li>
        <li>
          🌐 Site web : <Link href={SITE_URL}>{SITE_URL}</Link>
        </li>
      </ul>
      <p>
        Pour une assistance générale, vous pouvez également nous joindre à{" "}
        <Link href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</Link> ou via notre{" "}
        <Link href="/contact">formulaire de contact</Link>.
      </p>

      <h2>8. Note finale</h2>
      <p>Nous nous efforçons de maintenir un environnement de jeu sûr, créatif et équitable pour tous.</p>
      <p>
        Si vous êtes développeur ou artiste et pensez que votre œuvre a été utilisée sans
        autorisation, contactez-nous — nous traiterons votre demande avec soin et respect.
      </p>
    </>
  );
}

function dmcaPageNl(): ReactNode {
  return (
    <>
      <p>Laatst bijgewerkt: juni 2026</p>
      <p>
        Bij {SITE_NAME} respecteren we de intellectuele-eigendomsrechten van anderen en verwachten we
        dat onze gebruikers, partners en contentleveranciers hetzelfde doen. Deze kennisgeving
        onder de Digital Millennium Copyright Act (&ldquo;DMCA&rdquo;) legt uit hoe we
        auteursrechtelijke klachten behandelen en hoe u contact met ons kunt opnemen om een vermeende
        inbreuk te melden.
      </p>

      <h2>1. Ons beleid</h2>
      <p>
        {SITE_NAME} volgt de bepalingen van de DMCA (17 U.S.C. §512) en reageert snel op geldige
        meldingen van vermeende inbreuk.
      </p>
      <p>
        We nemen auteursrechtelijke kwesties serieus en zullen inbreukmakende content verwijderen of
        de toegang ertoe uitschakelen wanneer we daar op de juiste wijze van op de hoogte worden
        gesteld conform de wet.
      </p>
      <p>
        Als u van mening bent dat content op onze website (inclusief games, afbeeldingen of video&apos;s)
        inbreuk maakt op uw auteursrecht, volg dan de onderstaande stappen om een formele
        DMCA-verwijderingsmelding in te dienen.
      </p>

      <h2>2. Hoe een DMCA-verwijderingsmelding in te dienen</h2>
      <p>
        Om een melding van vermeende inbreuk in te dienen, stuurt u een schriftelijke mededeling met
        de volgende informatie:
      </p>
      <ol>
        <li>
          Uw volledige wettelijke naam en contactgegevens (e-mailadres, telefoonnummer en
          postadres).
        </li>
        <li>Een duidelijke beschrijving van het auteursrechtelijk beschermde werk dat volgens u is geschonden.</li>
        <li>
          Een specifieke link (URL) of voldoende informatie om het vermeend inbreukmakende materiaal
          op {SITE_NAME} te identificeren.
        </li>
        <li>
          Een verklaring dat u te goeder trouw van mening bent dat het betwiste gebruik niet is
          toegestaan door de auteursrechthebbende, diens vertegenwoordiger of de wet.
        </li>
        <li>
          Een verklaring dat de informatie in uw melding juist is en, op straffe van meineed, dat u
          de eigenaar bent (of bevoegd bent om namens de eigenaar op te treden) van het vermeend
          geschonden auteursrecht.
        </li>
        <li>Uw fysieke of elektronische handtekening.</li>
      </ol>
      <p>U kunt uw DMCA-melding per e-mail indienen bij:</p>
      <p>
        📧 <Link href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</Link>
      </p>

      <h2>3. Tegenmelding</h2>
      <p>
        Als uw content per vergissing of door verkeerde identificatie is verwijderd of uitgeschakeld,
        kunt u een tegenmelding indienen.
      </p>
      <p>Uw tegenmelding moet het volgende bevatten:</p>
      <ol>
        <li>Uw volledige naam, adres, telefoonnummer en e-mailadres.</li>
        <li>
          Identificatie van het materiaal dat is verwijderd of uitgeschakeld en de locatie waar het
          verscheen vóór verwijdering.
        </li>
        <li>
          Een verklaring op straffe van meineed dat u te goeder trouw van mening bent dat het
          materiaal is verwijderd of uitgeschakeld door een vergissing of verkeerde identificatie.
        </li>
        <li>
          Een verklaring dat u instemt met de jurisdictie van de rechtbanken in uw regio en dat u
          betekening van het proces zult accepteren van de persoon die de oorspronkelijke
          DMCA-melding heeft ingediend.
        </li>
        <li>Uw fysieke of elektronische handtekening.</li>
      </ol>
      <p>Tegenmeldingen moeten ook worden gestuurd naar:</p>
      <p>
        📧 <Link href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</Link>
      </p>

      <h2>4. Beleid voor herhaalde overtreders</h2>
      <p>
        In overeenstemming met de DMCA en andere toepasselijke wetten behoudt {SITE_NAME} zich het
        recht voor om gebruikersaccounts te beëindigen of op te schorten en content van herhaalde
        overtreders te verwijderen.
      </p>
      <p>
        We kunnen ook de toegang tot bepaalde functies of diensten beperken als we meerdere geldige
        klachten ontvangen met betrekking tot dezelfde gebruiker of uitgever.
      </p>

      <h2>5. Externe game-inhoud</h2>
      <p>
        Sommige games die op {SITE_NAME} worden gehost of ingesloten, komen van externe ontwikkelaars
        of bronnen.
      </p>
      <p>
        Als het vermeend inbreukmakende materiaal deel uitmaakt van een extern gehoste game, houd er
        dan rekening mee dat {SITE_NAME} mogelijk geen controle heeft over de oorspronkelijke inhoud.
        We zullen uw klacht echter doorsturen naar de verantwoordelijke partij of de nodige stappen
        ondernemen om de toegang op ons platform te beperken.
      </p>

      <h2>6. Goede trouw en misbruik van de DMCA</h2>
      <p>Het indienen van valse of misleidende DMCA-meldingen kan juridische gevolgen hebben.</p>
      <p>
        Zorg ervoor dat uw claim geldig is en gebaseerd op een oprechte overtuiging van inbreuk
        voordat u een melding indient.
      </p>

      <h2>7. Contactgegevens</h2>
      <p>
        Als u vragen heeft of verduidelijking nodig heeft voordat u een DMCA-melding indient,
        neem dan contact met ons op via:
      </p>
      <p>Juridische afdeling van {SITE_NAME}</p>
      <ul>
        <li>
          📧 E-mail: <Link href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</Link>
        </li>
        <li>
          🌐 Website: <Link href={SITE_URL}>{SITE_URL}</Link>
        </li>
      </ul>
      <p>
        Voor algemene ondersteuning kunt u ons ook bereiken via{" "}
        <Link href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</Link> of via ons{" "}
        <Link href="/contact">contactformulier</Link>.
      </p>

      <h2>8. Slotopmerking</h2>
      <p>We streven ernaar een veilige, creatieve en eerlijke speelomgeving voor iedereen te behouden.</p>
      <p>
        Bent u ontwikkelaar of artiest en denkt u dat uw werk zonder toestemming is gebruikt? Neem
        contact met ons op — we behandelen uw verzoek zorgvuldig en met respect.
      </p>
    </>
  );
}

export function getDmcaPageContent(locale: LocaleCode): ReactNode {
  switch (locale) {
    case "es":
      return dmcaPageEs();
    case "fr":
      return dmcaPageFr();
    case "nl":
      return dmcaPageNl();
    default:
      return dmcaPageEn();
  }
}
