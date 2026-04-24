const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const apiRoutes = require('./src/routes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

const defaultAllowedOrigins = [
  'https://portofolio-razzzzzwa-client.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
];

const configuredOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = configuredOrigins.length ? configuredOrigins : defaultAllowedOrigins;

const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      callback(null, true);
      return;
    }

    const isExactMatch = allowedOrigins.includes(origin);
    const isVercelPreview = /https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin);

    if (isExactMatch || isVercelPreview) {
      callback(null, true);
      return;
    }

    callback(new Error(`Origin not allowed by CORS: ${origin}`));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json());

app.use('/api', apiRoutes);

let portfolioContent = {};

app.get('/api/content', (req, res) => {
  res.json(portfolioContent);
});

app.post('/api/content', (req, res) => {
  portfolioContent = req.body;
  res.json({ success: true });
});

app.get('/', (_req, res) => {
  res.json({
    message: 'Portfolio API is running',
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});