const express = require('express');
const { getDb } = require('./mongo'); // Import the getDb function

const app = express();
const port = 3000;

app.get('/pop', async (req, res) => {
  const db = getDb(); // Get the MongoDB database object
  const collection = db.collection('entries');
  const id = req.params.id;

  try {
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
});

app.get('/users/:id', async (req, res) => {
  const db = getDb(); // Get the MongoDB database object
  const collection = db.collection('entries');
  const id = req.params.id;

  try {
    const user = await collection.findOne({ name: `Entry ${id}` });
    if (user) {
      res.json(user);
    } else {
      res.status(404).send('Data not found');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching user');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});