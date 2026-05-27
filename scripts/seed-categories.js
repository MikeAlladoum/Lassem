#!/usr/bin/env node

/**
 * Prisma Seed Script
 * Insère les catégories initiales dans la base de données
 * 
 * Usage:
 *   npx prisma db seed
 *   or
 *   node scripts/seed-categories.js
 */

require("dotenv").config({ path: ".env.local" });

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...\n");

  const categories = [
    {
      name: "Technologie",
      slug: "technologie",
      description: "Projets innovants de tech, logiciels et startups",
      icon_url:
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=200&h=200&fit=crop",
    },
    {
      name: "Arts & Culture",
      slug: "arts-culture",
      description: "Projets artistiques, musicaux et culturels",
      icon_url:
        "https://images.unsplash.com/photo-1549887534-7f540e1d7d10?w=200&h=200&fit=crop",
    },
    {
      name: "Jeux & Loisirs",
      slug: "jeux-loisirs",
      description: "Jeux vidéo, jeux de société et divertissements",
      icon_url:
        "https://images.unsplash.com/photo-1538481527235-669637c1296e?w=200&h=200&fit=crop",
    },
    {
      name: "Social & Environnement",
      slug: "social-environnement",
      description: "Projets sociaux, écologiques et durabilité",
      icon_url:
        "https://images.unsplash.com/photo-1559027615-cd2628902d4a?w=200&h=200&fit=crop",
    },
    {
      name: "Éducation",
      slug: "education",
      description: "Projets éducatifs, cours et formations",
      icon_url:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=200&fit=crop",
    },
    {
      name: "Santé & Bien-être",
      slug: "sante-bien-etre",
      description: "Projets de santé, fitness et bien-être",
      icon_url:
        "https://images.unsplash.com/photo-1576091160399-1f4ee4d6e0c4?w=200&h=200&fit=crop",
    },
    {
      name: "Autres",
      slug: "autres",
      description: "Autres types de projets",
      icon_url:
        "https://images.unsplash.com/photo-1553531889-e6cf89881704?w=200&h=200&fit=crop",
    },
  ];

  for (const category of categories) {
    const existingCategory = await prisma.category.findUnique({
      where: { slug: category.slug },
    });

    if (existingCategory) {
      console.log(`⏭️  Catégorie "${category.name}" déjà existe`);
    } else {
      const newCategory = await prisma.category.create({
        data: category,
      });
      console.log(`✅ Catégorie créée: "${newCategory.name}"`);
    }
  }

  console.log("\n🌱 Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
