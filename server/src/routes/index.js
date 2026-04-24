const express = require('express')
const { healthCheck } = require('../controllers/healthController')

const router = express.Router()

let portfolioContent = {}

router.get('/health', healthCheck)

router.get('/content', (req, res) => {
  res.json(portfolioContent)
})

router.post('/content', (req, res) => {
  portfolioContent = req.body
  res.json({ success: true })
})

module.exports = router