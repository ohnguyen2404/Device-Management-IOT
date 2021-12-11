const tenantController = require('../controllers').tenant
const {validator} = require('../middleware')

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow_Headers",
      "x-access-token, Origin, Content-Type, Accept"
    )
    next();
  })
 
  app.get("/tenants", tenantController.getAllTenants)
  app.get(
    "/tenants/:tenantId",
    [
      validator.checkExistedTenantId
    ],
    tenantController.getTenant
    )
  app.put("/tenants/:tenantId", tenantController.updateTenant)
  app.delete("/tenants/:tenantId", tenantController.removeTenant)
  
  app.post("/tenant", tenantController.createTenant)
}