import Link from "next/link";
import {
  CARS_ARENA_FAQS,
  CARS_ARENA_GAMEPLAY_ALT,
  CARS_ARENA_GAMEPLAY_IMAGE,
} from "@/lib/cars-arena-seo";
import "./game-seo-section.css";

const linkClass = "font-semibold text-[var(--color-accent)] underline underline-offset-2";

export function CarsArenaIntro() {
  return (
    <div className="max-w-3xl space-y-3 text-[0.95rem] leading-7 text-[var(--color-muted)]">
      <p>
        Looking for an exciting <strong>arcade racing game</strong>? Cars Arena combines 3D
        driving, drifting, and arena survival in a fast-paced battle for space. Drive across the
        platform, avoid collapsing tiles, outmaneuver rival cars, and try to stay in the arena
        until the end.
      </p>
    </div>
  );
}

export function CarsArenaArticle() {
  return (
    <div className="game-seo">
      <section className="game-seo-block" aria-labelledby="cars-arena-play-online">
        <h2 id="cars-arena-play-online" className="game-seo-heading">
          Play Cars Arena Online
        </h2>
        <div className="game-seo-prose">
          <p>
            You can play Cars Arena online in your browser. There is no download to start a
            round. The Cars Arena game drops you onto a floating platform with other drivers, and
            the floor does not stay whole for long.
          </p>
          <p>
            This is a car arena game built around space, not laps. Steer through the crowd, use a
            drift when you need to change direction quickly, and keep your car on the tiles that
            are still there.
          </p>
        </div>
      </section>

      <section className="game-seo-block" aria-labelledby="cars-arena-how-to">
        <h2 id="cars-arena-how-to" className="game-seo-heading">
          How to Play Cars Arena
        </h2>
        <div className="game-seo-prose">
          <p>
            Drive across the hexagonal platform and steer around the other cars. The arena is the
            whole course: there is no track loop to complete.
          </p>
          <p>
            Watch the floor while you move. Gray gaps open where tiles have fallen away. If your
            car leaves the remaining platform, that run is over.
          </p>
          <p>
            Drifting helps you turn without sliding off the edge. Stay clear of rival cars when
            the space gets tight, and keep enough room to reach a solid section of the arena.
          </p>
        </div>
      </section>

      <section className="game-seo-block" aria-labelledby="cars-arena-gameplay">
        <h2 id="cars-arena-gameplay" className="game-seo-heading">
          Cars Arena Gameplay
        </h2>
        <div className="game-seo-prose">
          <p>
            Cars Arena is a 3D car game set on a wide hexagonal platform. A band of red tiles
            often sits in the middle, while the rest of the floor is pale. As the match goes on,
            pieces of that floor disappear.
          </p>
          <p>
            Other drivers share the same space. You can see them moving across the arena, and the
            goal is simple: be the last car still standing on the platform. It plays more like a
            drifting game with a survival clock than a race to a finish line.
          </p>
        </div>
        <figure className="mx-auto mt-5 max-w-3xl">
          <img
            src={CARS_ARENA_GAMEPLAY_IMAGE}
            alt={CARS_ARENA_GAMEPLAY_ALT}
            width={1024}
            height={475}
            loading="lazy"
            decoding="async"
            className="h-auto w-full rounded-xl"
          />
          <figcaption className="mt-2 text-center text-sm text-[var(--color-muted)]">
            Cars Arena gameplay
          </figcaption>
        </figure>
      </section>

      <section className="game-seo-block" aria-labelledby="cars-arena-tips">
        <h2 id="cars-arena-tips" className="game-seo-heading">
          Tips and Tricks for Cars Arena
        </h2>
        <div className="game-seo-prose">
          <h3 className="game-seo-faq-question">1. Keep moving</h3>
          <p>
            A car that sits still is easy to crowd off the remaining tiles. Keep rolling so you
            can react when the floor changes.
          </p>
          <h3 className="game-seo-faq-question">2. Watch where the platform is disappearing</h3>
          <p>
            Gray gaps show where the arena has already broken. Look ahead of your car, not only
            at the drivers beside you.
          </p>
          <h3 className="game-seo-faq-question">3. Plan your escape route</h3>
          <p>
            Before a section collapses, pick a path toward solid tiles. Waiting until the gap is
            under your wheels leaves very little room to turn.
          </p>
          <h3 className="game-seo-faq-question">4. Use drifting to control your direction</h3>
          <p>
            A short drift can swing you away from an edge or around another car without a long,
            wide turn.
          </p>
          <h3 className="game-seo-faq-question">5. Avoid unnecessary risks near the edge</h3>
          <p>
            The outside of the platform is where one bump ends the run. Stay closer to intact
            tiles unless you need that space to get away.
          </p>
        </div>
      </section>

      <section className="game-seo-block" aria-labelledby="cars-arena-why">
        <h2 id="cars-arena-why" className="game-seo-heading">
          Why Play Cars Arena?
        </h2>
        <div className="game-seo-prose">
          <p>
            Rounds are short, and the 3D arena keeps changing. Drifting, quick steering, and a
            little patience matter more than memorizing a lap.
          </p>
          <p>
            If you like arcade racing and car competition without a traditional circuit, this
            survival format is easy to jump into. You can also look through{" "}
            <Link href="/c/racing" className={linkClass}>
              more racing games
            </Link>
            , try{" "}
            <Link href="/game/drift-dudes" className={linkClass}>
              other drifting games
            </Link>
            , or open{" "}
            <Link href="/c/arcade" className={linkClass}>
              more arcade games
            </Link>
            . For something else on four wheels, see{" "}
            <Link href="/game/retro-drift" className={linkClass}>
              other driving games
            </Link>{" "}
            or{" "}
            <Link href="/all-games" className={linkClass}>
              browse more games
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="game-seo-block" aria-labelledby="cars-arena-faq">
        <h2 id="cars-arena-faq" className="game-seo-heading">
          Frequently Asked Questions
        </h2>
        <div className="game-seo-faq-list">
          {CARS_ARENA_FAQS.map((faq) => (
            <div key={faq.question} className="game-seo-faq-item">
              <h3 className="game-seo-faq-question">{faq.question}</h3>
              <p className="game-seo-faq-answer">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
