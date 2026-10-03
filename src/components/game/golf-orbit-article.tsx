import Link from "next/link";
import {
  GOLF_ORBIT_FAQS,
  GOLF_ORBIT_GAMEPLAY_ALT,
  GOLF_ORBIT_GAMEPLAY_HEIGHT,
  GOLF_ORBIT_GAMEPLAY_IMAGE,
  GOLF_ORBIT_GAMEPLAY_WIDTH,
} from "@/lib/golf-orbit-seo";
import "./game-seo-section.css";

const linkClass = "font-semibold text-[var(--color-accent)] underline underline-offset-2";

export function GolfOrbitIntro() {
  return (
    <div className="max-w-3xl space-y-3 text-[0.95rem] leading-7 text-[var(--color-muted)]">
      <p>
        Looking for Golf Orbit Unblocked? Play Golf Orbit online and test your timing as you
        launch a golf ball through challenging courses. Hit the perfect shot, use ball bounce
        physics, avoid obstacles, and try to send the ball farther with every attempt.
      </p>
    </div>
  );
}

export function GolfOrbitArticle() {
  return (
    <div className="game-seo">
      <section className="game-seo-block" aria-labelledby="golf-orbit-play-online">
        <h2 id="golf-orbit-play-online" className="game-seo-heading">
          Play Golf Orbit Unblocked Online
        </h2>
        <div className="game-seo-prose">
          <p>
            You can play Golf Orbit online in your browser on Zen Fun Games. Golf Orbit Unblocked
            opens straight into a side-view course: a golfer, a golf ball, and a timing meter.
            There is no download. Line up the shot and see how far the ball travels.
          </p>
        </div>
      </section>

      <section className="game-seo-block" aria-labelledby="golf-orbit-how-to">
        <h2 id="golf-orbit-how-to" className="game-seo-heading">
          How to Play Golf Orbit
        </h2>
        <div className="game-seo-prose">
          <p>
            Watch the colored timing meter beside the golfer. The arrow moves across the wedge, and
            the moment you release decides the shot. A rushed swing sends the golf ball off the
            line you wanted.
          </p>
          <p>
            Shot power and distance are tied to that timing, and to the strength of the golfer.
            After the hit, bounce matters. A ball that keeps bouncing can add feet to the run. The
            distance counter, shown in feet, tells you how the attempt is going, and the flag on
            the bar marks a farther target.
          </p>
        </div>
      </section>

      <section className="game-seo-block" aria-labelledby="golf-orbit-gameplay">
        <h2 id="golf-orbit-gameplay" className="game-seo-heading">
          Golf Orbit Gameplay
        </h2>
        <div className="game-seo-prose">
          <p>
            Golf Orbit is an arcade golf game built around one idea: send the golf ball as far as
            you can. The course is a side view of grass, hills, and water, and each attempt starts
            with the ball on the ground in front of the golfer.
          </p>
          <p>
            The physics show up in the flight and the bounce. Strength changes how hard the hit
            is, speed changes how fast the ball flies, and bounce changes how much extra distance
            a landing can add. Coins from a run can be spent on those upgrades, including a purple
            ball that raises earning and power. The loop stays short: time the meter, launch, and
            try to beat the last distance.
          </p>
        </div>
        <figure className="mx-auto mt-5 max-w-3xl">
          <img
            src={GOLF_ORBIT_GAMEPLAY_IMAGE}
            alt={GOLF_ORBIT_GAMEPLAY_ALT}
            width={GOLF_ORBIT_GAMEPLAY_WIDTH}
            height={GOLF_ORBIT_GAMEPLAY_HEIGHT}
            loading="lazy"
            decoding="async"
            className="h-auto w-full rounded-xl"
          />
          <figcaption className="mt-2 text-center text-sm text-[var(--color-muted)]">
            Golf Orbit gameplay
          </figcaption>
        </figure>
      </section>

      <section className="game-seo-block" aria-labelledby="golf-orbit-tips">
        <h2 id="golf-orbit-tips" className="game-seo-heading">
          Golf Orbit Tips and Tricks
        </h2>
        <div className="game-seo-prose">
          <h3 className="game-seo-faq-question">1. Time your shot carefully</h3>
          <p>
            Let the arrow travel on the meter before you release. The colored wedge is the whole
            control for the swing.
          </p>
          <h3 className="game-seo-faq-question">2. Focus on power and distance</h3>
          <p>
            A stronger hit and a clean release are what move the distance number. Watch the feet
            counter and the flag on the progress bar.
          </p>
          <h3 className="game-seo-faq-question">3. Use ball bounce to your advantage</h3>
          <p>
            Bounce is its own upgrade. Extra bounce can carry the ball farther after it lands, so
            it is worth raising when you have the coins.
          </p>
          <h3 className="game-seo-faq-question">4. Watch the course ahead</h3>
          <p>
            The fairway runs toward hills and water. Look at where the ball is heading before you
            commit to the next swing.
          </p>
          <h3 className="game-seo-faq-question">5. Improve available upgrades when appropriate</h3>
          <p>
            Strength, speed, and bounce each change the shot. Spend coins on the stat that is
            holding the distance back, and use the purple ball when you want the extra power.
          </p>
        </div>
      </section>

      <section className="game-seo-block" aria-labelledby="golf-orbit-why">
        <h2 id="golf-orbit-why" className="game-seo-heading">
          Why Play Golf Orbit?
        </h2>
        <div className="game-seo-prose">
          <p>
            The controls stay simple: time the meter and launch. Under that, the shot still has
            physics, bounce, and a distance challenge you can retry in a few seconds.
          </p>
          <p>
            It is an arcade golf game that works as a quick browser session. You can look through{" "}
            <Link href="/c/sports" className={linkClass}>
              more sports games
            </Link>
            , open{" "}
            <Link href="/c/arcade" className={linkClass}>
              more arcade games
            </Link>
            , or{" "}
            <Link href="/all-games" className={linkClass}>
              browse more games
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="game-seo-block" aria-labelledby="golf-orbit-faq">
        <h2 id="golf-orbit-faq" className="game-seo-heading">
          Frequently Asked Questions
        </h2>
        <div className="game-seo-faq-list">
          {GOLF_ORBIT_FAQS.map((faq) => (
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
