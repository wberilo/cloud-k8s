const express = require('express');
const axios = require('axios');
const redis = require('redis');

// Create Redis client
const redisClient = redis.createClient();

// Create Express app
const app = express();
const port = 3000;

// Sample API endpoint
app.get('', (req, res) => {
  res.send('Cache server running');
})

app.get('/api/data/:key', async (req, res) => {
  const key = req.params.key; // Get key from request parameters

  // Check if data is cached in Redis
  redisClient.get(key, async (err, cachedData) => {
    if (err) throw err;

    if (cachedData) {
      // Data found in Redis cache
      console.log('Data found in cache');
      res.json(JSON.parse(cachedData)); // Return cached data as JSON response
    } else {
      try {
        // Make request to another program (example: http://localhost:4000)
        const response = await axios.get('http://localhost:4000/api/otherdata');
        const responseData = response.data;

        // Cache data in Redis for future requests
        redisClient.setex(key, 3600, JSON.stringify(responseData)); // Cache for 1 hour

        // Return response to client
        console.log('Data fetched from external API');
        res.json(responseData);
      } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).send('Error fetching data');
      }
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});