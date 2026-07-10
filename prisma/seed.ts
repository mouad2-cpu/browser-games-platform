import { PrismaClient, GameStatus, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const categories = [
  { slug: "action", name: "Action", icon: "zap", sortOrder: 1 },
  { slug: "puzzle", name: "Puzzle", icon: "puzzle", sortOrder: 2 },
  { slug: "racing", name: "Racing", icon: "car", sortOrder: 3 },
  { slug: "sports", name: "Sports", icon: "trophy", sortOrder: 4 },
  { slug: "arcade", name: "Arcade", icon: "gamepad", sortOrder: 5 },
  { slug: "strategy", name: "Strategy", icon: "crown", sortOrder: 6 },
];

const games = [
  {
    slug: "space-blaster",
    title: "Space Blaster",
    description: "Blast through waves of alien ships in this fast-paced arcade shooter.",
    thumbnail: "https://picsum.photos/seed/space-blaster/400/250",
    embedPath: "https://www.crazygames.com/embed/space-battle",
    featured: true,
    categories: ["action", "arcade"],
  },
  {
    slug: "block-puzzle-master",
    title: "Block Puzzle Master",
    description: "Fit blocks together and clear lines in this addictive puzzle game.",
    thumbnail: "https://picsum.photos/seed/block-puzzle/400/250",
    embedPath: "https://www.crazygames.com/embed/block-puzzle",
    featured: true,
    categories: ["puzzle"],
  },
  {
    slug: "turbo-racer",
    title: "Turbo Racer",
    description: "Race against the clock on challenging tracks with nitro boosts.",
    thumbnail: "https://picsum.photos/seed/turbo-racer/400/250",
    embedPath: "https://www.crazygames.com/embed/turbo-racing",
    featured: true,
    categories: ["racing"],
  },
  {
    slug: "penalty-kick-pro",
    title: "Penalty Kick Pro",
    description: "Score goals and become the ultimate penalty shootout champion.",
    thumbnail: "https://picsum.photos/seed/penalty-kick/400/250",
    embedPath: "https://www.crazygames.com/embed/penalty-shooters-2",
    featured: true,
    categories: ["sports"],
  },
  {
    slug: "tower-defense-kingdom",
    title: "Tower Defense Kingdom",
    description: "Build towers and defend your kingdom from endless enemy waves.",
    thumbnail: "https://picsum.photos/seed/tower-defense/400/250",
    embedPath: "https://www.crazygames.com/embed/kingdom-defense",
    featured: false,
    categories: ["strategy"],
  },
  {
    slug: "retro-snake",
    title: "Retro Snake",
    description: "Classic snake game with modern twists and power-ups.",
    thumbnail: "https://picsum.photos/seed/retro-snake/400/250",
    embedPath: "https://www.crazygames.com/embed/snake-io",
    featured: false,
    categories: ["arcade"],
  },
  {
    slug: "bubble-shooter-deluxe",
    title: "Bubble Shooter Deluxe",
    description: "Pop colorful bubbles and clear the board before time runs out.",
    thumbnail: "https://picsum.photos/seed/bubble-shooter/400/250",
    embedPath: "https://www.crazygames.com/embed/bubble-shooter",
    featured: true,
    categories: ["puzzle", "arcade"],
  },
  {
    slug: "ninja-dash",
    title: "Ninja Dash",
    description: "Run, jump, and slash through obstacles as a stealthy ninja warrior.",
    thumbnail: "https://picsum.photos/seed/ninja-dash/400/250",
    embedPath: "https://www.crazygames.com/embed/ninja-clash",
    featured: false,
    categories: ["action"],
  },
  {
    slug: "drift-king",
    title: "Drift King",
    description: "Master the art of drifting on tight corners and earn style points.",
    thumbnail: "https://picsum.photos/seed/drift-king/400/250",
    embedPath: "https://www.crazygames.com/embed/drift-hunters",
    featured: false,
    categories: ["racing"],
  },
  {
    slug: "basketball-stars",
    title: "Basketball Stars",
    description: "Dunk, shoot, and block your way to victory in 1v1 basketball matches.",
    thumbnail: "https://picsum.photos/seed/basketball-stars/400/250",
    embedPath: "https://www.crazygames.com/embed/basketball-stars",
    featured: true,
    categories: ["sports"],
  },
  {
    slug: "chess-challenge",
    title: "Chess Challenge",
    description: "Test your chess skills against AI opponents of increasing difficulty.",
    thumbnail: "https://picsum.photos/seed/chess-challenge/400/250",
    embedPath: "https://www.crazygames.com/embed/chess-online",
    featured: false,
    categories: ["strategy", "puzzle"],
  },
  {
    slug: "pixel-platformer",
    title: "Pixel Platformer",
    description: "Jump across platforms, collect coins, and defeat bosses in retro style.",
    thumbnail: "https://picsum.photos/seed/pixel-platformer/400/250",
    embedPath: "https://www.crazygames.com/embed/super-pickleball-adventure",
    featured: false,
    categories: ["action", "arcade"],
  },
  {
    slug: "word-connect",
    title: "Word Connect",
    description: "Find hidden words by connecting letters in this brain-teasing puzzle.",
    thumbnail: "https://picsum.photos/seed/word-connect/400/250",
    embedPath: "https://www.crazygames.com/embed/word-wipe",
    featured: false,
    categories: ["puzzle"],
  },
  {
    slug: "city-builder",
    title: "City Builder",
    description: "Plan roads, zones, and services to grow a thriving metropolis.",
    thumbnail: "https://picsum.photos/seed/city-builder/400/250",
    embedPath: "https://www.crazygames.com/embed/city-builder",
    featured: false,
    categories: ["strategy"],
  },
  {
    slug: "soccer-legends",
    title: "Soccer Legends",
    description: "Play fast-paced soccer matches with legendary players and special moves.",
    thumbnail: "https://picsum.photos/seed/soccer-legends/400/250",
    embedPath: "https://www.crazygames.com/embed/soccer-legends",
    featured: false,
    categories: ["sports"],
  },
  {
    slug: "gem-match",
    title: "Gem Match",
    description: "Swap gems to create matches of three or more and trigger cascades.",
    thumbnail: "https://picsum.photos/seed/gem-match/400/250",
    embedPath: "https://www.crazygames.com/embed/jewel-shuffle",
    featured: false,
    categories: ["puzzle", "arcade"],
  },
  {
    slug: "zombie-survival",
    title: "Zombie Survival",
    description: "Fight off hordes of zombies with weapons and barricades.",
    thumbnail: "https://picsum.photos/seed/zombie-survival/400/250",
    embedPath: "https://www.crazygames.com/embed/zombie-outbreak",
    featured: true,
    categories: ["action"],
  },
  {
    slug: "mini-golf-paradise",
    title: "Mini Golf Paradise",
    description: "Putt through creative courses with ramps, loops, and obstacles.",
    thumbnail: "https://picsum.photos/seed/mini-golf/400/250",
    embedPath: "https://www.crazygames.com/embed/minigolf-clash",
    featured: false,
    categories: ["sports"],
  },
  {
    slug: "stack-tower",
    title: "Stack Tower",
    description: "Stack blocks as high as you can without letting them fall.",
    thumbnail: "https://picsum.photos/seed/stack-tower/400/250",
    embedPath: "https://www.crazygames.com/embed/stack",
    featured: false,
    categories: ["arcade"],
  },
  {
    slug: "battle-tanks",
    title: "Battle Tanks",
    description: "Command your tank and destroy enemy bases in tactical combat.",
    thumbnail: "https://picsum.photos/seed/battle-tanks/400/250",
    embedPath: "https://www.crazygames.com/embed/tanks-battlefield",
    featured: false,
    categories: ["action", "strategy"],
  },
];

const PREVIEW_VIDEOS = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
];

async function main() {
  console.log("Seeding database...");

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }

  const categoryMap = Object.fromEntries(
    (await prisma.category.findMany()).map((c) => [c.slug, c.id])
  );

  for (const [index, game] of games.entries()) {
    const { categories: catSlugs, ...gameData } = game;
    const primarySlug = catSlugs[0];
    const primaryCategoryId = primarySlug ? categoryMap[primarySlug] : undefined;
    const now = new Date();
    const previewVideo = PREVIEW_VIDEOS[index % PREVIEW_VIDEOS.length];

    const created = await prisma.game.upsert({
      where: { slug: gameData.slug },
      update: {
        title: gameData.title,
        description: gameData.description,
        thumbnail: gameData.thumbnail,
        previewVideo,
        embedPath: gameData.embedPath,
        featured: gameData.featured,
        status: GameStatus.published,
        primaryCategoryId,
        releasedAt: now,
      },
      create: {
        title: gameData.title,
        slug: gameData.slug,
        description: gameData.description,
        thumbnail: gameData.thumbnail,
        previewVideo,
        embedPath: gameData.embedPath,
        featured: gameData.featured,
        status: GameStatus.published,
        primaryCategoryId,
        addedAt: now,
        releasedAt: now,
      },
    });

    await prisma.gameCategory.deleteMany({ where: { gameId: created.id } });
    for (const slug of catSlugs) {
      const categoryId = categoryMap[slug];
      if (categoryId) {
        await prisma.gameCategory.create({
          data: { gameId: created.id, categoryId },
        });
      }
    }
  }

  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: { role: Role.SUPER_ADMIN },
    create: {
      username: "admin",
      email: "admin@example.com",
      passwordHash: adminPassword,
      role: Role.SUPER_ADMIN,
    },
  });

  const modPassword = await bcrypt.hash("mod123456", 12);
  await prisma.user.upsert({
    where: { username: "moderator" },
    update: {},
    create: {
      username: "moderator",
      email: "mod@example.com",
      passwordHash: modPassword,
      role: Role.MODERATOR,
    },
  });

  const devPassword = await bcrypt.hash("dev123456", 12);
  const devUser = await prisma.user.upsert({
    where: { username: "devstudio" },
    update: {},
    create: {
      username: "devstudio",
      email: "dev@example.com",
      passwordHash: devPassword,
      role: Role.USER,
    },
  });

  const developer = await prisma.developer.upsert({
    where: { userId: devUser.id },
    update: {},
    create: {
      userId: devUser.id,
      companyName: "Pixel Forge Studio",
      revenueShare: 0.7,
      totalRevenue: 125.5,
    },
  });

  await prisma.gameUpload.create({
    data: {
      developerId: developer.id,
      title: "Neon Jump",
      description: "A fast-paced platformer with neon visuals.",
      embedPath: "https://example.com/games/neon-jump",
      thumbnail: "https://picsum.photos/seed/neon-jump/400/250",
      scanStatus: "CLEAN",
    },
  });

  const slots = [
    { name: "Homepage Banner", placement: "HOME" as const, cpm: 2.5 },
    { name: "Pre-Game Interstitial", placement: "PRE_GAME" as const, cpm: 4.0 },
    { name: "Sidebar Rectangle", placement: "SIDEBAR" as const, cpm: 1.8 },
  ];

  for (const slot of slots) {
    const existing = await prisma.adSlot.findFirst({ where: { name: slot.name } });
    if (!existing) {
      const created = await prisma.adSlot.create({ data: slot });
      await prisma.adCampaign.create({
        data: {
          name: `${slot.name} - Default`,
          slotId: created.id,
          cpm: slot.cpm,
          impressions: Math.floor(Math.random() * 5000) + 1000,
          clicks: Math.floor(Math.random() * 200) + 20,
          isActive: true,
        },
      });
    }
  }

  await prisma.platformSetting.upsert({
    where: { key: "platform" },
    update: {},
    create: {
      key: "platform",
      value: JSON.stringify({
        siteName: "BrowserGames",
        cdnUrl: "",
        domain: "localhost:3000",
        featureFlags: { userRegistration: true, developerUploads: true, adsEnabled: false },
      }),
    },
  });

  await prisma.moderationFlag.deleteMany({ where: { entityId: "sample" } });
  await prisma.moderationFlag.create({
    data: {
      entityType: "game",
      entityId: "sample",
      reason: "Sample flag for moderation queue demo",
      status: "PENDING",
    },
  });

  const menuPages = [
    {
      slug: "contact",
      title: "Contact Us",
      icon: "mail",
      sortOrder: 1,
      content:
        "Have a question, feedback, or need help with a game? We would love to hear from you.\n\nEmail us at support@zenfungames.com\n\nWe usually reply within 1–2 business days.",
    },
    {
      slug: "terms",
      title: "Terms of Service",
      icon: "scale",
      sortOrder: 2,
      content:
        "Last updated: June 2026\n\nBy using ZenFun Games, you agree to these terms. Please read them carefully before playing or browsing our site.\n\nUsing our service\nYou may use ZenFun Games for personal, non-commercial entertainment. Do not attempt to disrupt the site, abuse other users, or upload harmful content.",
    },
    {
      slug: "privacy",
      title: "Privacy Policy",
      icon: "shield",
      sortOrder: 3,
      content:
        "Last updated: June 2026\n\nZenFun Games respects your privacy. This policy explains what information we collect and how we use it.\n\nInformation we collect\nWe may collect basic usage data such as pages visited, games played, and cookies used to remember recently played games.",
    },
    {
      slug: "information-for-parents",
      title: "Information for Parents",
      icon: "users",
      sortOrder: 4,
      content:
        "Guidance for parents about safe, family-friendly gaming on ZenFun Games.",
    },
    {
      slug: "dmca-notice",
      title: "DMCA Notice",
      icon: "scale",
      sortOrder: 5,
      content:
        "Digital Millennium Copyright Act notice and takedown procedures for ZenFun Games.",
    },
  ];

  for (const page of menuPages) {
    await prisma.menuPage.upsert({
      where: { slug: page.slug },
      update: {},
      create: { ...page, published: true },
    });
  }

  console.log("Seed complete: 6 categories, 20 games, 5 menu pages");
  console.log("Staff: admin/admin123 (SUPER_ADMIN), moderator/mod123456 (MODERATOR)");
  console.log("Developer: devstudio/dev123456");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
