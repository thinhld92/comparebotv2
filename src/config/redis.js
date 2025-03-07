// src/config/redis.js
const redis = require('redis');
require('dotenv').config(); // Load biến môi trường từ .env

const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  password: process.env.REDIS_PASSWORD || null,
});

redisClient.on('connect', () => {
  console.log('Đã kết nối với Redis');
});

redisClient.on('error', (err) => {
  console.error('Lỗi kết nối Redis:', err);
});

// Kết nối tới Redis
(async () => {
  await redisClient.connect();
})();

module.exports = redisClient;