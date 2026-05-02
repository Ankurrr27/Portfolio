const { MongoClient } = require('mongodb');
require('dotenv').config();

async function checkAll() {
  const url = process.env.DATABASE_URL;
  const client = new MongoClient(url);
  try {
    await client.connect();
    const db = client.db();
    const achievementCol = db.collection('Achievement');
    
    const all = await achievementCol.find({}).toArray();
    console.log("All Achievements:");
    all.forEach(a => {
      console.log(`- ${a.title}: category type: ${typeof a.category}, value: ${JSON.stringify(a.category)}`);
    });
    
  } finally {
    await client.close();
  }
}

checkAll();
