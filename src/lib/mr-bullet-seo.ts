import type { FaqItemInput } from "@/lib/structured-data/types";

export const MR_BULLET_SLUG = "mr-bullet-2";

export const MR_BULLET_TITLE =
  "Mr Bullet Unblocked – Play Mr Bullet - Spy Puzzles Online | Zen Fun Games";

export const MR_BULLET_DESCRIPTION =
  "Play Mr Bullet Unblocked online at Zen Fun Games. Solve spy puzzles, aim carefully, and use ricocheting bullets to defeat enemies in this physics-based shooting game.";

export const MR_BULLET_H1 = "Mr Bullet Unblocked - Play Mr Bullet - Spy Puzzles";

/** Existing cover. It shows the spy character, not a gameplay ricochet. */
export const MR_BULLET_IMAGE = "/uploads/thumbnails/mr-bullet-2.png";
export const MR_BULLET_IMAGE_ALT =
  "Mr Bullet 2 cover art of a spy in sunglasses holding two guns";
export const MR_BULLET_IMAGE_WIDTH = 1536;
export const MR_BULLET_IMAGE_HEIGHT = 1024;

export const MR_BULLET_FAQS: FaqItemInput[] = [
  {
    question: "What is Mr Bullet - Spy Puzzles?",
    answer:
      "Mr Bullet - Spy Puzzles is a physics-based shooting puzzle game where you use carefully aimed bullets and ricochets to defeat enemies.",
  },
  {
    question: "Can I play Mr Bullet Unblocked online?",
    answer: "Yes, you can play Mr Bullet online directly in your browser on Zen Fun Games.",
  },
  {
    question: "How do you play Mr Bullet?",
    answer:
      "Aim your shot carefully, fire your bullet, and use walls and objects to create ricochets that help you eliminate enemies.",
  },
  {
    question: "Is Mr Bullet a puzzle game?",
    answer:
      "Yes. Mr Bullet combines shooting mechanics with physics-based puzzles that require careful aiming and planning.",
  },
  {
    question: "Is Mr Bullet an online game?",
    answer: "Yes, the game can be played online through a supported web browser.",
  },
];

export function isMrBulletSlug(slug: string): boolean {
  return slug === MR_BULLET_SLUG;
}
