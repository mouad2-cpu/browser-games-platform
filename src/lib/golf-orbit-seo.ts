import type { FaqItemInput } from "@/lib/structured-data/types";

export const GOLF_ORBIT_SLUG = "golf-orbit";

export const GOLF_ORBIT_TITLE =
  "Golf Orbit Unblocked – Play Golf Orbit Online | Zen Fun Games";

export const GOLF_ORBIT_DESCRIPTION =
  "Play Golf Orbit Unblocked online for free at Zen Fun Games. Hit the golf ball, master your timing, bounce past obstacles, and launch your shot as far as possible.";

export const GOLF_ORBIT_H1 = "Golf Orbit Unblocked - Play Golf Orbit Online";

/** Promo cover: golfer on a planet, title, and a large golf ball. Not the play screen. */
export const GOLF_ORBIT_MAIN_IMAGE = "/game-covers/golf-orbit.png";
export const GOLF_ORBIT_MAIN_ALT =
  "Golf Orbit cover art of a golfer on a green planet beside a large golf ball";

export const GOLF_ORBIT_GAMEPLAY_IMAGE = "/game-covers/golf-orbit-gameplay.png";
export const GOLF_ORBIT_GAMEPLAY_WIDTH = 1024;
export const GOLF_ORBIT_GAMEPLAY_HEIGHT = 477;
/**
 * The supplied screen is the pre-shot view: the ball is still on the ground,
 * a rainbow timing meter sits beside the golfer, and strength, speed, and
 * bounce upgrades are on screen. It does not show the ball in flight.
 */
export const GOLF_ORBIT_GAMEPLAY_ALT =
  "Golf Orbit gameplay showing a golfer timing a shot beside a power meter";

export const GOLF_ORBIT_FAQS: FaqItemInput[] = [
  {
    question: "What is Golf Orbit?",
    answer:
      "Golf Orbit is an arcade-style golf game where players launch a golf ball and try to achieve the greatest distance while navigating the course.",
  },
  {
    question: "Can I play Golf Orbit Unblocked online?",
    answer: "Yes, you can play Golf Orbit online directly in your browser on Zen Fun Games.",
  },
  {
    question: "How do you play Golf Orbit?",
    answer:
      "Time your shot on the power meter, launch the golf ball, and use bounce and shot power to send it as far as you can.",
  },
  {
    question: "Is Golf Orbit an arcade golf game?",
    answer:
      "Yes. Golf Orbit combines simple golf mechanics with arcade-style gameplay focused on timing, distance, and ball physics.",
  },
  {
    question: "Can I play Golf Orbit for free?",
    answer:
      "Yes, Golf Orbit can be played online for free through a supported web browser on Zen Fun Games.",
  },
];

export function isGolfOrbitSlug(slug: string): boolean {
  return slug === GOLF_ORBIT_SLUG;
}
