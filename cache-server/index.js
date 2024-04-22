const express = require('express');
const axios = require('axios');
const redis = require('redis');

const redisClient = redis.createClient({
  host: 'redis-service.default.svc.cluster.local', 
  port: 6379, 
  legacyMode: true
});

const app = express();
const port = 3000;

app.get('', (req, res) => {
  res.send('Cache server running');
})

app.get('/api/data/:key', async (req, res) => {
  const key = req.params.key; 
  console.log('Key:', key);

  try {
    const cachedData = await new Promise((resolve, reject) => {
      redisClient.get(key, (err, data) => {
        if (err) reject(err);
        resolve(data);
      });

      setTimeout(() => {
        reject(new Error('Redis get operation timed out'));
      }, 5000);
    });

    if (cachedData) {
      console.log('Data found in cache');
      const dataRetrieved = JSON.parse(cachedData);
      return res.json({responseData:dataRetrieved, cache:true});
    } else {
      console.log('Data not found in cache');
      const response = await axios.get('http://node-mongo-service:3000/users/' + key);
      const responseData = response.data;
      console.log('Data fetched from external API', responseData);

      await new Promise((resolve, reject) => {
        redisClient.setex(key, 3600, JSON.stringify(responseData), (err) => {
          if (err) reject(err);
          resolve();
        });
      });
      console.log('Data cached in Redis');

      console.log('Data fetched from external API');
      return res.json({responseData, cache: false});
    }
  } catch (error) {
    console.error('Error fetching data:', error.message);
    return res.status(500).send('Error fetching data');
  }
});

app.listen(port, async () => {
  await redisClient.connect();
  console.log(`Server running on port ${port}`);
});