const express = require('express')
const { healthCheck } = require('../controllers/healthController')

const router = express.Router()

let portfolioContent = {}

// existing route
router.get('/health', healthCheck)

// ✅ ADD THIS
router.get('/content', (req, res) => {
  res.json(portfolioContent)
})

// ✅ ADD THIS
router.post('/content', (req, res) => {
  portfolioContent = req.body
  res.json({ success: true })
})

module.exports = router