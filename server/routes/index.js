const authRoutes = require('./auth')
const userRoutes = require('./user')
const deviceRoutes = require('./device')
const customerRoutes = require('./customer')
const tenantRoutes = require('./tenant')

module.exports = (app) => {
  authRoutes(app),
  userRoutes(app),
  deviceRoutes(app),
  customerRoutes(app),
  tenantRoutes(app)
}