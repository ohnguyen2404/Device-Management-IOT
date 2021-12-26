const deviceRoutes = require('./device')
const customerRoutes = require('./customer')
const tenantRoutes = require('./tenant')

module.exports = (app) => {
  deviceRoutes(app),
  customerRoutes(app),
  tenantRoutes(app)
}