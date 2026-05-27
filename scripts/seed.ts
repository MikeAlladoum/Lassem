/**
 * ═══════════════════════════════════════════════════════════════
 * SEED SCRIPT - Web3 DApp Crowdfunding
 * ═══════════════════════════════════════════════════════════════
 * 
 * Creates realistic test data with:
 * - Admin user
 * - Creator users with campaigns
 * - Contributor users with contributions
 * - Complete relational integrity
 * 
 * Run with: npx ts-node scripts/seed.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...\n");

  // ════════════════════════════════════════
  // 1. CLEAR EXISTING DATA (Optional)
  // ════════════════════════════════════════
  console.log("🧹 Cleaning up existing data...");
  await prisma.contribution.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.category.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.user.deleteMany();

  // ════════════════════════════════════════
  // 2. CREATE CATEGORIES
  // ════════════════════════════════════════
  console.log("📂 Creating categories...");
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Technology",
        slug: "technology",
        description: "Innovative tech projects and startups",
        icon_url: "💻",
      },
    }),
    prisma.category.create({
      data: {
        name: "Energy",
        slug: "energy",
        description: "Renewable energy and green initiatives",
        icon_url: "⚡",
      },
    }),
    prisma.category.create({
      data: {
        name: "Robotics",
        slug: "robotics",
        description: "Autonomous robots and AI projects",
        icon_url: "🤖",
      },
    }),
    prisma.category.create({
      data: {
        name: "Blockchain",
        slug: "blockchain",
        description: "Web3 and blockchain applications",
        icon_url: "⛓️",
      },
    }),
  ]);

  console.log(`  ✓ Created ${categories.length} categories`);

  // ════════════════════════════════════════
  // 3. CREATE USERS
  // ════════════════════════════════════════
  console.log("\n👥 Creating users...");

  // Admin user
  const admin = await prisma.user.create({
    data: {
      wallet_address: "0x5b0e4ecefd39e3c491728aa8af5b49a83cad94b4",
      username: "admin_platform",
      email: "admin@damlegend.io",
      role: "admin",
      bio: "Platform administrator",
      avatar_url: "https://avatars.dicebear.com/api/avataaars/admin.svg",
      is_active: true,
      is_visible: true,
    },
  });

  // Creator users
  const creators = await Promise.all([
    prisma.user.create({
      data: {
        wallet_address: "0x1234567890123456789012345678901234567890",
        username: "alice_creator",
        email: "alice@example.com",
        role: "creator",
        bio: "Tech innovator passionate about blockchain",
        avatar_url: "https://avatars.dicebear.com/api/avataaars/alice.svg",
        is_active: true,
        is_visible: true,
      },
    }),
    prisma.user.create({
      data: {
        wallet_address: "0x2345678901234567890123456789012345678901",
        username: "bob_green_energy",
        email: "bob@example.com",
        role: "creator",
        bio: "Green energy enthusiast",
        avatar_url: "https://avatars.dicebear.com/api/avataaars/bob.svg",
        is_active: true,
        is_visible: true,
      },
    }),
    prisma.user.create({
      data: {
        wallet_address: "0x3456789012345678901234567890123456789012",
        username: "carol_robotics",
        email: "carol@example.com",
        role: "creator",
        bio: "Robotics researcher and entrepreneur",
        avatar_url: "https://avatars.dicebear.com/api/avataaars/carol.svg",
        is_active: true,
        is_visible: true,
      },
    }),
  ]);

  // Contributor users
  const contributors = await Promise.all([
    prisma.user.create({
      data: {
        wallet_address: "0x4567890123456789012345678901234567890123",
        username: "david_investor",
        email: "david@example.com",
        role: "contributor",
        bio: "Early stage investor",
        avatar_url: "https://avatars.dicebear.com/api/avataaars/david.svg",
        is_active: true,
        is_visible: true,
      },
    }),
    prisma.user.create({
      data: {
        wallet_address: "0x5678901234567890123456789012345678901234",
        username: "emma_supporter",
        email: "emma@example.com",
        role: "contributor",
        bio: "Supporting innovative projects",
        avatar_url: "https://avatars.dicebear.com/api/avataaars/emma.svg",
        is_active: true,
        is_visible: true,
      },
    }),
    prisma.user.create({
      data: {
        wallet_address: "0x6789012345678901234567890123456789012345",
        username: "frank_enthusiast",
        email: "frank@example.com",
        role: "contributor",
        bio: "Tech enthusiast and blockchain believer",
        avatar_url: "https://avatars.dicebear.com/api/avataaars/frank.svg",
        is_active: true,
        is_visible: true,
      },
    }),
  ]);

  console.log(`  ✓ Created 1 admin + ${creators.length} creators + ${contributors.length} contributors`);

  // ════════════════════════════════════════
  // 4. CREATE CAMPAIGNS
  // ════════════════════════════════════════
  console.log("\n🚀 Creating campaigns...");

  const campaigns = await Promise.all([
    // Campaign 1: Active blockchain project
    prisma.campaign.create({
      data: {
        title: "DeFi Protocol V2 - Next Gen Trading",
        description:
          "Revolutionary decentralized trading protocol with zero-knowledge proofs for privacy.",
        goal_amount: "50.5",
        current_amount: "35.25",
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        status: "active",
        image_url: "https://images.unsplash.com/photo-1639762681033-6461d5d6ecc9?w=500",
        creator_id: creators[0].id,
        category_id: categories[3].id, // Blockchain
        is_active: true,
        is_visible: true,
        created_by: admin.id,
      },
    }),

    // Campaign 2: Active energy project
    prisma.campaign.create({
      data: {
        title: "Solar Panel Installation Network",
        description: "Building distributed solar panel network across Africa.",
        goal_amount: "100.0",
        current_amount: "62.75",
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        status: "active",
        image_url: "https://images.unsplash.com/photo-1509391366360-2e0b411dc282?w=500",
        creator_id: creators[1].id,
        category_id: categories[1].id, // Energy
        is_active: true,
        is_visible: true,
        created_by: admin.id,
      },
    }),

    // Campaign 3: Robotics - Near completion
    prisma.campaign.create({
      data: {
        title: "Autonomous Delivery Robots",
        description: "AI-powered last-mile delivery solution for urban environments.",
        goal_amount: "75.0",
        current_amount: "74.5",
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        status: "active",
        image_url: "https://images.unsplash.com/photo-1561757411-d3fee03d3a5f?w=500",
        creator_id: creators[2].id,
        category_id: categories[2].id, // Robotics
        is_active: true,
        is_visible: true,
        created_by: admin.id,
      },
    }),

    // Campaign 4: Completed technology project
    prisma.campaign.create({
      data: {
        title: "AI Code Assistant Platform",
        description: "Completed: AI-powered IDE plugin for developers.",
        goal_amount: "30.0",
        current_amount: "32.5",
        deadline: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        status: "succeeded",
        image_url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500",
        creator_id: creators[0].id,
        category_id: categories[0].id, // Technology
        is_active: true,
        is_visible: true,
        created_by: admin.id,
      },
    }),
  ]);

  console.log(`  ✓ Created ${campaigns.length} campaigns`);

  // ════════════════════════════════════════
  // 5. CREATE CONTRIBUTIONS
  // ════════════════════════════════════════
  console.log("\n💰 Creating contributions...");

  const contributions = await Promise.all([
    // Campaign 1 contributions
    prisma.contribution.create({
      data: {
        campaign_id: campaigns[0].id,
        contributor_id: contributors[0].id,
        amount: "5.0",
        tx_hash: "0xabc123def456" + Math.random().toString(16).slice(2),
        status: "confirmed",
        contributed_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        is_active: true,
        is_visible: true,
        created_by: admin.id,
      },
    }),
    prisma.contribution.create({
      data: {
        campaign_id: campaigns[0].id,
        contributor_id: contributors[1].id,
        amount: "10.25",
        tx_hash: "0xdef456abc789" + Math.random().toString(16).slice(2),
        status: "confirmed",
        contributed_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        is_active: true,
        is_visible: true,
        created_by: admin.id,
      },
    }),
    prisma.contribution.create({
      data: {
        campaign_id: campaigns[0].id,
        contributor_id: contributors[2].id,
        amount: "20.0",
        tx_hash: "0x789abc123def" + Math.random().toString(16).slice(2),
        status: "confirmed",
        contributed_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        is_active: true,
        is_visible: true,
        created_by: admin.id,
      },
    }),

    // Campaign 2 contributions
    prisma.contribution.create({
      data: {
        campaign_id: campaigns[1].id,
        contributor_id: contributors[0].id,
        amount: "15.5",
        tx_hash: "0x111222333444" + Math.random().toString(16).slice(2),
        status: "confirmed",
        is_active: true,
        is_visible: true,
        created_by: admin.id,
      },
    }),
    prisma.contribution.create({
      data: {
        campaign_id: campaigns[1].id,
        contributor_id: contributors[1].id,
        amount: "25.0",
        tx_hash: "0x222333444555" + Math.random().toString(16).slice(2),
        status: "confirmed",
        is_active: true,
        is_visible: true,
        created_by: admin.id,
      },
    }),
    prisma.contribution.create({
      data: {
        campaign_id: campaigns[1].id,
        contributor_id: contributors[2].id,
        amount: "22.25",
        tx_hash: "0x333444555666" + Math.random().toString(16).slice(2),
        status: "confirmed",
        is_active: true,
        is_visible: true,
        created_by: admin.id,
      },
    }),

    // Campaign 3 contributions (nearly funded)
    prisma.contribution.create({
      data: {
        campaign_id: campaigns[2].id,
        contributor_id: contributors[0].id,
        amount: "30.0",
        tx_hash: "0x444555666777" + Math.random().toString(16).slice(2),
        status: "confirmed",
        is_active: true,
        is_visible: true,
        created_by: admin.id,
      },
    }),
    prisma.contribution.create({
      data: {
        campaign_id: campaigns[2].id,
        contributor_id: contributors[1].id,
        amount: "44.5",
        tx_hash: "0x555666777888" + Math.random().toString(16).slice(2),
        status: "confirmed",
        is_active: true,
        is_visible: true,
        created_by: admin.id,
      },
    }),

    // Campaign 4 contributions (completed)
    prisma.contribution.create({
      data: {
        campaign_id: campaigns[3].id,
        contributor_id: contributors[0].id,
        amount: "8.5",
        tx_hash: "0x666777888999" + Math.random().toString(16).slice(2),
        status: "confirmed",
        is_active: true,
        is_visible: true,
        created_by: admin.id,
      },
    }),
    prisma.contribution.create({
      data: {
        campaign_id: campaigns[3].id,
        contributor_id: contributors[1].id,
        amount: "12.0",
        tx_hash: "0x777888999aaa" + Math.random().toString(16).slice(2),
        status: "confirmed",
        is_active: true,
        is_visible: true,
        created_by: admin.id,
      },
    }),
    prisma.contribution.create({
      data: {
        campaign_id: campaigns[3].id,
        contributor_id: contributors[2].id,
        amount: "12.0",
        tx_hash: "0x888999aaa111" + Math.random().toString(16).slice(2),
        status: "confirmed",
        is_active: true,
        is_visible: true,
        created_by: admin.id,
      },
    }),
  ]);

  console.log(`  ✓ Created ${contributions.length} contributions`);

  // ════════════════════════════════════════
  // 6. SUMMARY
  // ════════════════════════════════════════
  console.log("\n" + "=".repeat(60));
  console.log("✅ DATABASE SEED COMPLETED SUCCESSFULLY\n");
  console.log("📊 SUMMARY:");
  console.log(`   • Categories: ${categories.length}`);
  console.log(`   • Users: 1 admin + ${creators.length} creators + ${contributors.length} contributors`);
  console.log(`   • Campaigns: ${campaigns.length}`);
  console.log(`   • Contributions: ${contributions.length}`);
  console.log("\n🔐 TEST WALLETS:");
  console.log(`   Admin:        ${admin.wallet_address}`);
  console.log(`   Creator (1):  ${creators[0].wallet_address}`);
  console.log(`   Creator (2):  ${creators[1].wallet_address}`);
  console.log(`   Creator (3):  ${creators[2].wallet_address}`);
  console.log(`   Contributor:  ${contributors[0].wallet_address}`);
  console.log("\n💡 TIP: Use these wallets in MetaMask to test the DApp");
  console.log("=".repeat(60) + "\n");

  console.log("✨ Seed completed!");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
