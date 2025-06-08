const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/forecast', async (req, res) => {
    const { lat, lon } = req.query;
    if (!lat || !lon) return res.status(400).json({ error: 'Thiếu tọa độ' });
    
    const key = `weather:${lat},${lon}`;
    const redisClient = req.app.get('redisClient');

    try {
        const cached = await redisClient.get(key);
        if (cached) {
            console.log('→ Redis Cache HIT:', key);
            return res.json(JSON.parse(cached));
        }

        const response = await axios.get('https://api.weatherapi.com/v1/forecast.json', {
            params: {
                key: process.env.WEATHER_API_KEY,
                q: `${lat},${lon}`,
                days: 6,
                aqi: 'yes',
                alerts: 'no'
            }
        });

        const data = response.data;
        await redisClient.setEx(key, 600, JSON.stringify(data)); // TTL 600s = 10 phút
        console.log('→ Redis Cache MISS:', key);

        res.json(data);
    } catch (err) {
        console.error('Lỗi lấy dự báo thời tiết:', err);
        res.status(500).json({ error: 'Không thể lấy dữ liệu thời tiết' });
    }
});

router.get('/airquality', async (req, res) => {
    const { lat, lon } = req.query;
    if (!lat || !lon) return res.status(400).json({ error: 'Thiếu tọa độ' });

    const apiKey = process.env.IQAIR_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Chưa cấu hình API Key cho IQAir' });

    try {
        const response = await axios.get('https://api.airvisual.com/v2/nearest_city', {
            params: {
                lat,
                lon,
                key: apiKey
            }
        });

        const data = response.data;
        res.json(data);
    } catch (err) {
        console.error('Lỗi gọi IQAir API:', err.message);
        res.status(500).json({ error: 'Không thể lấy dữ liệu từ IQAir' });
    }
});


const fs = require('fs');

router.post('/log', (req, res) => {
    const { city, lat, lon } = req.body;
    const timestamp = new Date().toISOString();
    const log = `[${timestamp}] Truy vấn: ${city} (${lat}, ${lon})\n`;
    fs.appendFile('logs/queries.log', log, (err) => {
        if (err) {
            console.error('Lỗi ghi log:', err);
            return res.status(500).json({ error: 'Không thể ghi log' });
        }
        res.status(200).json({ message: 'Đã ghi log' });
    });
});


module.exports = router;