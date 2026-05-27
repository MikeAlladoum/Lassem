require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding test campaigns...');
  console.log('DATABASE_URL:', process.env.DATABASE_URL);
  
  try {
    // Create users first
    console.log('📝 Creating users...');
    const users = await Promise.all([
      prisma.user.create({
        data: {
          wallet_address: '0x' + '1'.repeat(40),
          username: 'ai_creator',
          role: 'creator',
        },
      }),
      prisma.user.create({
        data: {
          wallet_address: '0x' + '2'.repeat(40),
          username: 'web3_creator',
          role: 'creator',
        },
      }),
      prisma.user.create({
        data: {
          wallet_address: '0x' + '3'.repeat(40),
          username: 'robotics_creator',
          role: 'creator',
        },
      }),
      prisma.user.create({
        data: {
          wallet_address: '0x' + '4'.repeat(40),
          username: 'battery_creator',
          role: 'creator',
        },
      }),
      prisma.user.create({
        data: {
          wallet_address: '0x' + '5'.repeat(40),
          username: 'fitness_creator',
          role: 'creator',
        },
      }),
    ]);

    console.log(`✅ Created ${users.length} users`);

    // Create categories
    console.log('📂 Creating categories...');
    const categories = await Promise.all([
      prisma.category.upsert({
        where: { id: 1 },
        update: {},
        create: {
          id: 1,
          name: 'Technology',
          slug: 'technology',
        },
      }),
      prisma.category.upsert({
        where: { id: 2 },
        update: {},
        create: {
          id: 2,
          name: 'Blockchain',
          slug: 'blockchain',
        },
      }),
      prisma.category.upsert({
        where: { id: 3 },
        update: {},
        create: {
          id: 3,
          name: 'Robotics',
          slug: 'robotics',
        },
      }),
      prisma.category.upsert({
        where: { id: 4 },
        update: {},
        create: {
          id: 4,
          name: 'Energy',
          slug: 'energy',
        },
      }),
    ]);

    console.log(`✅ Created/verified ${categories.length} categories`);

    // Create campaigns
    console.log('🚀 Creating campaigns...');
    const campaigns = await Promise.all([
      prisma.campaign.create({
        data: {
          title: 'AI Photo Editor Révolutionnaire',
          description: 'Une IA qui édite vos photos avec une qualité professionnelle',
          image_url: 'https://images.unsplash.com/photo-1611532736590-e6e6ca2e1a67?w=600&h=400&fit=crop',
          goal_amount: 50000,
          current_amount: 32000,
          status: 'active',
          deadline: new Date('2025-06-30'),
          category_id: 1,
          creator_id: 1,
          is_visible: true,
          is_active: true,
          created_by: 1,
        },
      }),
      prisma.campaign.create({
        data: {
          title: 'Plateforme Web3 Décentralisée',
          description: 'Le réseau social blockchain 100% décentralisé avec confidentialité',
          image_url: 'https://images.unsplash.com/photo-1639762681033-f461231fa4ad?w=600&h=400&fit=crop',
          goal_amount: 100000,
          current_amount: 75000,
          status: 'active',
          deadline: new Date('2025-07-15'),
          category_id: 2,
          creator_id: 2,
          is_visible: true,
          is_active: true,
          created_by: 1,
        },
      }),
      prisma.campaign.create({
        data: {
          title: 'Robot de Livraison Autonome',
          description: 'Livraison 24/7 en moins de 30 minutes dans la ville',
          image_url: 'https://images.unsplash.com/photo-1516981104078-42bc97929032?w=600&h=400&fit=crop',
          goal_amount: 250000,
          current_amount: 185000,
          status: 'active',
          deadline: new Date('2025-08-30'),
          category_id: 3,
          creator_id: 3,
          is_visible: true,
          is_active: true,
          created_by: 1,
        },
      }),
      prisma.campaign.create({
        data: {
          title: 'Batterie Graphène Ultra-Rapide',
          description: 'Recharge 80% en 5 minutes, durée 10 ans garantie',
          image_url: 'https://images.unsplash.com/photo-1591290619990-12c08e8ba4cd?w=600&h=400&fit=crop',
          goal_amount: 150000,
          current_amount: 45000,
          status: 'active',
          deadline: new Date('2025-07-31'),
          category_id: 4,
          creator_id: 4,
          is_visible: true,
          is_active: true,
          created_by: 1,
        },
      }),
      prisma.campaign.create({
        data: {
          title: 'Application Fitness IA',
          description: 'Coach personnel avec IA, reconnaît vos mouvements en temps réel',
          image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop',
          goal_amount: 80000,
          current_amount: 92000,
          status: 'succeeded',
          deadline: new Date('2025-05-15'),
          category_id: 1,
          creator_id: 5,
          is_visible: true,
          is_active: true,
          created_by: 1,
        },
      }),
    ]);

    console.log(`✅ Created ${campaigns.length} test campaigns`);
    campaigns.forEach((c, i) => {
      console.log(`   ${i + 1}. ${c.title} (${c.current_amount}/${c.goal_amount} ETH - ${Math.round((c.current_amount/c.goal_amount)*100)}%)`);
    });
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
