const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const apiRoutes = require('./src/routes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
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