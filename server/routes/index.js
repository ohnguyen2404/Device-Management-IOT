const deviceRoutes = require('./device')
const customerRoutes = require('./customer')
const tenantRoutes = require('./tenant')
const widgetsBundleRoute = require('./widgetsBundle')
const widgetTypeRoute = require('./widgetType')

module.exports = (app) => {
  deviceRoutes(app),
  customerRoutes(app),
  tenantRoutes(app),
  widgetsBundleRoute(app),
  widgetTypeRoute(app)
}