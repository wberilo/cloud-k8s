const express = require('express');
const { getDb } = require('./db'); // Import the getDb function

const app = express();
const port = 3000;

app.get('/users/:id', async (req, res) => {
  const db = getDb(); // Get the MongoDB database object
  const collection = db.collection('users');
  const id = req.params.id;

  try {
    const user = await collection.findOne({ id: id});
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