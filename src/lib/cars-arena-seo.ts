import type { FaqItemInput } from "@/lib/structured-data/types";

export const CARS_ARENA_SLUG = "cars-arena";

export const CARS_ARENA_TITLE = "Cars Arena – Play Online for Free | Zen Fun Games";

export const CARS_ARENA_DESCRIPTION =
  "Play Cars Arena online for free at Zen Fun Games. Drift across a 3D arena, outmaneuver rival cars, and stay on the platform to become the last driver standing.";

export const CARS_ARENA_H1 = "Cars Arena - Play Free Online";

/** Existing stadium cover. It is not the gameplay screen. */
export const CARS_ARENA_MAIN_IMAGE = "/game-covers/cars-arena.png";
export const CARS_ARENA_MAIN_ALT = "Cars Arena cover art with cars in a stadium";

export const CARS_ARENA_GAMEPLAY_IMAGE = "/game-covers/cars-arena-gameplay.png";
/**
 * The supplied screen shows several cars on a white hexagonal platform,
 * with red tiles in the middle and gray gaps where the floor has broken away.
 */
export const CARS_ARENA_GAMEPLAY_ALT =
  "Cars Arena gameplay showing cars on a hexagonal arena as tiles break away";

export const CARS_ARENA_FAQS: FaqItemInput[] = [
  {
    question: "What is Cars Arena?",
    answer:
      "Cars Arena is a 3D arcade driving game where players compete for space on a platform while the arena gradually breaks apart.",
  },
  {
    question: "How do you win in Cars Arena?",
    answer:
      "Stay on the platform longer than the other drivers and avoid falling as the arena becomes harder to navigate.",
  },
  {
    question: "Is Cars Arena a racing game?",
    answer:
      "Cars Arena is an arcade racing and drifting game with a survival-focused arena format rather than traditional lap racing.",
  },
  {
    question: "Can I play Cars Arena online?",
    answer:
      "Yes, Cars Arena can be played online through a web browser when the game is available on a supported gaming platform.",
  },
  {
    question: "Is Cars Arena a 3D game?",
    answer:
      "Yes. Cars Arena uses a 3D driving environment with drifting, arena movement, and physics-based gameplay.",
  },
];

export function isCarsArenaSlug(slug: string): boolean {
  return slug === CARS_ARENA_SLUG;
}
