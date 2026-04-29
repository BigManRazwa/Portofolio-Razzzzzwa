const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const apiRoutes = require('./src/routes');
const { loadPortfolioContent, savePortfolioContent, isFirebaseConfigured } = require('./src/services/firebase');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

let portfolioContent = {};

// Load portfolio content from Firestore on startup
async function initializeContent() {
  try {
    const firebaseContent = await loadPortfolioContent();
    if (firebaseContent) {
      portfolioContent = firebaseContent;
      console.log('Portfolio content loaded from Firestore');
    } else {
      console.log('No portfolio content found in Firestore, starting with empty state');
    }
  } catch (error) {
    console.error('Failed to load portfolio content on startup:', error.message);
  }
}

app.get('/api/content', (req, res) => {
  res.json(portfolioContent);
});

app.post('/api/content', async (req, res) => {
  try {
    portfolioContent = req.body;
    
    // Save to Firestore if configured
    if (isFirebaseConfigured) {
      await savePortfolioContent(portfolioContent);
    } else {
      console.warn('Firebase not configured. Changes saved to memory only (will be lost on restart).');
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving portfolio content:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/', (_req, res) => {
  res.json({
    message: 'Portfolio API is running',
  });
});

app.listen(PORT, '0.0.0.0', async () => {
  console.log(`Server running on port ${PORT}`);
  await initializeContent();
});