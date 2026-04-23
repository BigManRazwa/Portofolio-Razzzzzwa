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

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
