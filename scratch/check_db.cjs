const { MongoClient } = require('mongodb');
require('dotenv').config();

async function check() {
  const url = process.env.DATABASE_URL;
  const client = new MongoClient(url);
  try {
    await client.connect();
    const db = client.db();
    const collections = await db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));
    
    const achievementCol = db.collection('Achievement');
    const count = await achievementCol.countDocuments();
    console.log("Total achievements in 'Achievement' collection:", count);
    
    const sample = await achievementCol.findOne({});
    console.log("Sample achievement:", JSON.stringify(sample, null, 2));
    
  } finally {
    await client.close();
  }
}

check();
