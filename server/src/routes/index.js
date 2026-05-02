const express = require('express')
const multer = require('multer')
const { healthCheck } = require('../controllers/healthController')
const {
  uploadImage,
  deleteImage,
  listImages,
  initializeBucket,
} = require('../controllers/imageController')

const router = express.Router()

// Configure multer for in-memory file handling
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
})

let portfolioContent = {}

// Health check
router.get('/health', healthCheck)

// Portfolio content
router.get('/content', (req, res) => {
  res.json(portfolioContent)
})

router.post('/content', (req, res) => {
  portfolioContent = req.body
  res.json({ success: true })
})

// Image upload routes
router.post('/images/upload', upload.single('file'), uploadImage)
router.delete('/images/:folder/:filename', deleteImage)
router.get('/images/:folder', listImages)
router.post('/images/init', initializeBucket)

module.exports = router