import type { FaqItemInput } from "@/lib/structured-data/types";

export const RETRO_DRIFT_SLUG = "retro-drift";

/** Document `<title>`. Kept exactly as requested. */
export const RETRO_DRIFT_TITLE = "Retro Drift – Play Online for Free | Zen Fun Games";

/** Meta description. Kept exactly as requested. */
export const RETRO_DRIFT_DESCRIPTION =
  "Play Retro Drift online for free at Zen Fun Games. Master sharp turns, perform smooth drifts, and challenge yourself to achieve the highest score in this fun arcade racing game.";

/** Single visible H1. The article heading is not repeated below the game. */
export const RETRO_DRIFT_H1 = "Retro Drift - Play Free Online";

/** Neon cover used as the game thumbnail. It shows a car drifting on a night road. */
export const RETRO_DRIFT_MAIN_IMAGE = "/game-covers/retro-drift.png";
export const RETRO_DRIFT_MAIN_ALT =
  "Retro Drift online racing game with a car drifting around a track";

export const RETRO_DRIFT_GAMEPLAY_IMAGE = "/game-covers/retro-drift-gameplay.png";
/**
 * The supplied screen shows a pink car on a straight city road with tire tracks,
 * not a sharp turn, so the alt text describes what is actually visible.
 */
export const RETRO_DRIFT_GAMEPLAY_ALT =
  "Retro Drift gameplay showing a pink car on a city road";

export const RETRO_DRIFT_FAQS: FaqItemInput[] = [
  {
    question: "Is Retro Drift free to play?",
    answer: "Yes, Retro Drift can be played online for free through Zen Fun Games.",
  },
  {
    question: "Can I play Retro Drift online?",
    answer:
      "Yes. You can play Retro Drift online directly from your browser through Zen Fun Games.",
  },
  {
    question: "How do you play Retro Drift?",
    answer:
      "Control your car through the track, manage your speed, and use well-timed drifts to navigate corners while maintaining control.",
  },
  {
    question: "Is Retro Drift a racing game?",
    answer:
      "Yes. Retro Drift is an arcade-style racing and drifting game focused on quick reactions, cornering, and driving control.",
  },
  {
    question: "Is Retro Drift difficult?",
    answer:
      "The basic gameplay is easy to understand, but mastering the drifting and challenging corners can take practice.",
  },
];

export function isRetroDriftSlug(slug: string): boolean {
  return slug === RETRO_DRIFT_SLUG;
}
