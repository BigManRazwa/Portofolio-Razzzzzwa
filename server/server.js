const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const apiRoutes = require('./src/routes')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get('/', (_req, res) => {
  res.json({
    message: 'Portfolio API is running',
  })
})

app.use('/api', apiRoutes)

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
