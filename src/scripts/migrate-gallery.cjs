const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function migrate() {
  console.log("Starting migration: GalleryItem -> Achievement");
  
  try {
    const galleryItems = await prisma.galleryItem.findMany();
    console.log(`Found ${galleryItems.length} gallery items.`);

    for (const item of galleryItems) {
      await prisma.achievement.create({
        data: {
          title: item.title || "Gallery Migration",
          imageUrl: item.url,
          subType: item.category || "Event",
          dateLabel: item.dateLabel || null,
          displayOrder: item.displayOrder || 0,
          isCarousel: true,
          featured: true,
          description: "Migrated from gallery."
        }
      });
      console.log(`Migrated: ${item.title}`);
    }

    console.log("Migration complete!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

migrate();
