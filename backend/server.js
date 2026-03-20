const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Backend is running!',
        time: new Date().toISOString(),
    });
});

app.get('/health', async (req, res) => {
    try {
        res.json({
            db: 'connected', 
            timestamp: new Date()
        });
    } catch (error) {
        res.status(500).json({
            db: 'error',
            message: error.message,
        });
    }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server started on ${PORT}`)
});