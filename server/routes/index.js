const authRoutes = require('./auth')
const userRoutes = require('./user')

module.exports = (app) => {
  authRoutes(app),
  userRoutes(app)
}