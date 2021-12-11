const tenantController = require('../controllers').tenant
const {validator, authJwt} = require('../middleware')

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow_Headers",
      "x-access-token, Origin, Content-Type, Accept"
    )
    next();
  })
 
  app.get(
    "/tenants",
    [
      authJwt.verifyToken,
      authJwt.isAdmin
    ],
    tenantController.getAllTenants)
  app.get(
    "/tenants/:tenantId",
    [
      authJwt.verifyToken,
      authJwt.isTenantOrAdmin,
      validator.checkExistedTenantId
    ],
    tenantController.getTenant
    )
  app.put(
    "/tenants/:tenantId",
    [
      authJwt.verifyToken,
      authJwt.isAdmin,
      validator.checkExistedTenantId
    ],
    tenantController.updateTenant)
  app.delete(
    "/tenants/:tenantId",
    [
      authJwt.verifyToken,
      authJwt.isAdmin,
      validator.checkExistedTenantId
    ],
    tenantController.removeTenant)
  
  app.post("/tenant", tenantController.createTenant)
}