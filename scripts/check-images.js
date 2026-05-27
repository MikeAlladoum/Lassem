const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkImages() {
  try {
    const campaigns = await prisma.campaign.findMany({
      where: { id: { in: [10, 11, 12, 13, 14] } },
      select: { id: true, title: true, category_id: true, image_url: true },
      orderBy: { id: 'asc' }
    });

    console.log('\n📸 Current Campaign Images:\n');
    campaigns.forEach(c => {
      console.log(`ID ${c.id} (${c.title}):`);
      console.log(`  Category: ${c.category_id}`);
      console.log(`  Image: ${c.image_url}\n`);
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkImages();
