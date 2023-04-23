require('dotenv').config()

module.exports = {
  // dbURL: process.env.ATLAS_URL,
  dbURL: 'mongodb+srv://mister_toy:1234@cluster0.ycjq23s.mongodb.net/?retryWrites=true&w=majority',
  // dbName: process.env.ATLAS_DB_NAME
  dbName: 'toy_db'
}

