const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function updateImages() {
  try {
    console.log("🔄 Mise à jour des images des campagnes...");

    // Mise à jour des campagnes existantes avec les images locales
    const updates = [
      { id: 10, title: "AI Photo Editor", image_url: "/photo-ia-editor.webp" },
      { id: 11, title: "Web3 Platform", image_url: "/blockchain-app.png" },
      { id: 12, title: "Robot Delivery", image_url: "/robot.webp" },
      { id: 13, title: "Battery", image_url: "/battery.webp" },
      { id: 14, title: "Fitness App", image_url: "/fitness-app.png" },
    ];

    for (const update of updates) {
      await prisma.campaign.update({
        where: { id: update.id },
        data: { image_url: update.image_url },
      });
      console.log(`✅ ${update.title} → ${update.image_url}`);
    }

    // Chercher ou créer la campagne "Salon de Coiffure"
    let salonCampaign = await prisma.campaign.findFirst({
      where: { title: { contains: "Salon", mode: "insensitive" } },
    });

    if (salonCampaign) {
      await prisma.campaign.update({
        where: { id: salonCampaign.id },
        data: { image_url: "/salon-coifure.jpg" },
      });
      console.log(`✅ Salon de Coiffure (ID: ${salonCampaign.id}) → /salon-coifure.jpg`);
    } else {
      // Créer une nouvelle campagne pour le salon de coiffure (catégorie: Technology)
      const newCampaign = await prisma.campaign.create({
        data: {
          title: "Salon de Coiffure",
          description: "Un salon de coiffure moderne avec les dernières technologies",
          image_url: "/salon-coifure.jpg",
          goal_amount: 50000, // 50000 wei (0.00005 ETH)
          current_amount: 0,
          status: "active",
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
          category_id: 1, // Technology
          creator_id: 1,
          created_by: 1,
          is_visible: true,
          is_active: true,
        },
      });
      console.log(`✨ Nouveau projet créé: Salon de Coiffure (ID: ${newCampaign.id})`);
    }

    console.log("✅ Toutes les images ont été mises à jour!");
  } catch (error) {
    console.error("❌ Erreur:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

updateImages();
