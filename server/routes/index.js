const authRoutes = require('./auth')
const userRoutes = require('./user')
const deviceRoutes = require('./device')

module.exports = (app) => {
  authRoutes(app),
  userRoutes(app),
  deviceRoutes(app)
}