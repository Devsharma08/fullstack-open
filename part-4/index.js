require('dotenv').config()
const mongoose = require('mongoose')
const app = require('./app')

const mongoUrl = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bloglist'
const port = process.env.PORT || 3003

if (!process.env.SECRET) {
  console.error('SECRET environment variable is not defined')
  process.exit(1)
}

mongoose.connect(mongoUrl, { family: 4 })
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`)
    })
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message)
    process.exit(1)
  })
