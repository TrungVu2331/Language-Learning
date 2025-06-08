require('dotenv').config();
const express = require('express');
const app = express();
const weatherRoutes = require('./routes/weather');
const cors = require('cors');
const redis = require('redis');
const redisClient = redis.createClient();

app.use(cors()); // Cho phép frontend gọi từ domain khác
app.use(express.json());

app.use('/api/weather', require('./routes/weather'));
app.use('/api/weather', weatherRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
