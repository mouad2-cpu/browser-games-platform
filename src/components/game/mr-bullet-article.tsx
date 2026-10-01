import Link from "next/link";
import { MR_BULLET_FAQS } from "@/lib/mr-bullet-seo";
import "./game-seo-section.css";

const linkClass = "font-semibold text-[var(--color-accent)] underline underline-offset-2";

export function MrBulletIntro() {
  return (
    <div className="max-w-3xl space-y-3 text-[0.95rem] leading-7 text-[var(--color-muted)]">
      <p>
        Looking for Mr Bullet Unblocked? Play Mr Bullet - Spy Puzzles online and test your aim in
        challenging shooting puzzles. Use ricochets, physics, and careful shots to defeat enemies
        and complete each spy mission.
      </p>
    </div>
  );
}

export function MrBulletArticle() {
  return (
    <div className="game-seo">
      <section className="game-seo-block" aria-labelledby="mr-bullet-play-online">
        <h2 id="mr-bullet-play-online" className="game-seo-heading">
          Play Mr Bullet Unblocked Online
        </h2>
        <div className="game-seo-prose">
          <p>
            You can play Mr Bullet online in your browser on Zen Fun Games. Open the page and
            start a level without installing anything. Each stage is a small shooting puzzle: line
            up a shot, then see where the bullet actually travels.
          </p>
        </div>
      </section>

      <section className="game-seo-block" aria-labelledby="mr-bullet-how-to">
        <h2 id="mr-bullet-how-to" className="game-seo-heading">
          How to Play Mr Bullet - Spy Puzzles
        </h2>
        <div className="game-seo-prose">
          <p>
            Aim before you fire. A straight shot only works when nothing blocks the path to an
            enemy. When a wall or object is in the way, use it. Bullets ricochet, so the bounce
            is part of the solution.
          </p>
          <p>
            Look at the whole level first. Note where the enemies stand and which surfaces can
            send a bullet around a corner. One planned shot is more useful than firing until the
            round is gone.
          </p>
        </div>
      </section>

      <section className="game-seo-block" aria-labelledby="mr-bullet-gameplay">
        <h2 id="mr-bullet-gameplay" className="game-seo-heading">
          Mr Bullet Gameplay
        </h2>
        <div className="game-seo-prose">
          <p>
            Mr Bullet - Spy Puzzles is a physics shooting game. You clear a scene by hitting
            enemies with carefully aimed bullets. The interesting part is the path: a shot can
            bounce off walls and objects, so the line you picture is often not a straight line.
          </p>
          <p>
            Levels stay short. You read the room, choose an angle, and commit to the shot. That
            mix of aiming and puzzle solving is the whole loop.
          </p>
        </div>
      </section>

      <section className="game-seo-block" aria-labelledby="mr-bullet-tips">
        <h2 id="mr-bullet-tips" className="game-seo-heading">
          Mr Bullet Tips and Tricks
        </h2>
        <div className="game-seo-prose">
          <h3 className="game-seo-faq-question">1. Aim carefully before shooting</h3>
          <p>Set the angle while you still have time to look. A rushed shot usually misses the bounce you needed.</p>
          <h3 className="game-seo-faq-question">2. Look for ricochet opportunities</h3>
          <p>If an enemy is behind cover, find a wall that can send the bullet around it.</p>
          <h3 className="game-seo-faq-question">3. Use the environment to reach difficult targets</h3>
          <p>Objects in the level are part of the puzzle. Use them to change the bullet&apos;s path.</p>
          <h3 className="game-seo-faq-question">4. Plan your shot before wasting bullets</h3>
          <p>Trace the path in your head, including the bounce, before you fire.</p>
          <h3 className="game-seo-faq-question">5. Pay attention to enemy positions and obstacles</h3>
          <p>A clear lane and a blocked lane need different angles. Check both before you commit.</p>
        </div>
      </section>

      <section className="game-seo-block" aria-labelledby="mr-bullet-why">
        <h2 id="mr-bullet-why" className="game-seo-heading">
          Why Play Mr Bullet?
        </h2>
        <div className="game-seo-prose">
          <p>
            The appeal is the shot itself. Aiming, physics, and ricochets turn a simple fire
            button into a spy puzzle you can finish in a short browser session.
          </p>
          <p>
            When you want something else, try{" "}
            <Link href="/c/action" className={linkClass}>
              more action games
            </Link>
            ,{" "}
            <Link href="/c/puzzle" className={linkClass}>
              more puzzle games
            </Link>
            , or{" "}
            <Link href="/c/arcade" className={linkClass}>
              more arcade games
            </Link>
            . You can also{" "}
            <Link href="/all-games" className={linkClass}>
              browse more games
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="game-seo-block" aria-labelledby="mr-bullet-faq">
        <h2 id="mr-bullet-faq" className="game-seo-heading">
          Frequently Asked Questions
        </h2>
        <div className="game-seo-faq-list">
          {MR_BULLET_FAQS.map((faq) => (
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
