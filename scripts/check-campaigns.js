const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkCampaigns() {
  try {
    const allCampaigns = await prisma.campaign.findMany({
      select: {
        id: true,
        title: true,
        image_url: true,
        status: true,
        is_visible: true,
        is_active: true,
      },
      orderBy: { created_at: "desc" },
    });

    console.log("📊 TOUTES LES CAMPAGNES:");
    console.log(`Total: ${allCampaigns.length}\n`);
    allCampaigns.forEach((c) => {
      console.log(`ID: ${c.id} | ${c.title} | Visible: ${c.is_visible} | Active: ${c.is_active} | Status: ${c.status}`);
    });

    console.log("\n🔍 CAMPAGNES VISIBLES ET ACTIVES:");
    const filtered = allCampaigns.filter(c => c.is_visible && c.is_active);
    console.log(`Count: ${filtered.length}`);
    filtered.forEach((c) => {
      console.log(`ID: ${c.id} | ${c.title} | Image: ${c.image_url}`);
    });
  } finally {
    await prisma.$disconnect();
  }
}

checkCampaigns();
