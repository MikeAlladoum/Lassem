const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    const campaigns = await prisma.campaign.findMany({
      select: { id: true, title: true, is_visible: true, is_active: true, status: true }
    });
    console.log('Campagnes en base:');
    console.log(JSON.stringify(campaigns, null, 2));
  } catch (err) {
    console.error('Erreur:', err.message);
  } finally {
    await prisma.$disconnect();
  }
})();
