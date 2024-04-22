const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI; // MongoDB URI from Kubernetes env
const dbName = 'your_database_name'; // MongoDB database name

let db;

async function connectToMongoDB() {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    db = client.db(dbName);
    await addEntriesToDb();
    console.log('Entries added to database');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

connectToMongoDB();

async function addEntriesToDb() {
  try {
    const collection = db.collection('entries');
    const entries = [];
    for (let i = 1; i <= 10; i++) {
      entries.push({ id: i, name: `Entry ${i}` });
    }
    const res = await collection.insertMany(entries);
    console.log(entries);
    console.log('Entries added to database', res);
  } catch (error) {
    console.error('Error adding entries to database:', error);
  }
}


function getDb() {
  return db;
}

module.exports = { getDb };