const { MongoClient } = require('mongodb');
require('dotenv').config();

async function migrate() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL not found");
    return;
  }

  const client = new MongoClient(url);
  try {
    await client.connect();
    const db = client.db(); // Uses the DB from the URL
    const collection = db.collection('Achievement');

    console.log("Checking achievements for inconsistent category data...");
    
    const cursor = collection.find({});
    let updatedCount = 0;

    while (await cursor.hasNext()) {
      const doc = await cursor.next();
      if (doc.category && typeof doc.category === 'string') {
        console.log(`Migrating achievement: "${doc.title}" - Category: "${doc.category}" -> ["${doc.category}"]`);
        await collection.updateOne(
          { _id: doc._id },
          { $set: { category: [doc.category] } }
        );
        updatedCount++;
      }
    }

    console.log(`Migration complete. Updated ${updatedCount} records.`);
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await client.close();
  }
}

migrate();
