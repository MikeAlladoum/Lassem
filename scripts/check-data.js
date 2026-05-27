const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkData() {
  try {
    const users = await prisma.user.findMany({ take: 5 });
    const categories = await prisma.category.findMany();
    
    console.log("📊 UTILISATEURS:");
    users.forEach(u => console.log(`  ID: ${u.id}, Username: ${u.username}`));
    
    console.log("\n📂 CATÉGORIES:");
    categories.forEach(c => console.log(`  ID: ${c.id}, Name: ${c.name}`));
    
  } finally {
    await prisma.$disconnect();
  }
}

checkData();
