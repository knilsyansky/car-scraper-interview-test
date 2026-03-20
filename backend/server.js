import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import dotenv from 'dotenv';

// Routes
import apiRouter from '#routes/index.js';

// Services
import scraperService from '#services/scraper.service.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes 
app.use('/api', apiRouter);

app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        message: 'CarSensor API is running',
        version: '1.0.0'
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date() });
});


// Worker
cron.schedule('0 * * * *', async () => {
    console.log('Running scheduled scraping...');
    await scraperService.run();
});


const PORT = process.env.PORT || 3001;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server started on ${PORT}`)
});