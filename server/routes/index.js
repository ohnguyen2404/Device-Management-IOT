const authRoutes = require('./auth.routes')
const userRoutes = require('./user.routes')

module.exports = (app) => {
  authRoutes(app),
  userRoutes(app)
}