const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Cartes avec images professionnelles, réalistes et cohérentes
const campaignUpdates = {
  10: { // AI Photo Editor Révolutionnaire
    // Software editing interface
    image_url: 'https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg?auto=compress&cs=tinysrgb&w=800&h=600'
  },
  11: { // Plateforme Web3 Décentralisée
    // Blockchain code programming
    image_url: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800&h=600'
  },
  12: { // Robot de Livraison Autonome
    // Drone technology autonomous
    image_url: 'https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg?auto=compress&cs=tinysrgb&w=800&h=600'
  },
  13: { // Batterie Graphène Ultra-Rapide
    // Energy battery power tech
    image_url: 'https://images.pexels.com/photos/3856025/pexels-photo-3856025.jpeg?auto=compress&cs=tinysrgb&w=800&h=600'
  },
  14: { // Application Fitness IA
    // Fitness workout sports activity
    image_url: 'https://images.pexels.com/photos/3808008/pexels-photo-3808008.jpeg?auto=compress&cs=tinysrgb&w=800&h=600'
  }
};

async function updateCampaignImages() {
  try {
    console.log('🔄 Mise à jour des images des campagnes...\n');

    for (const [id, updates] of Object.entries(campaignUpdates)) {
      const campaign = await prisma.campaign.update({
        where: { id: parseInt(id) },
        data: updates,
        select: { id: true, title: true, image_url: true }
      });
      console.log(`✅ Campagne ${campaign.id}: ${campaign.title}`);
      console.log(`   Image: ${campaign.image_url}\n`);
    }

    console.log('✨ Toutes les images ont été mises à jour avec succès!');
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateCampaignImages();
