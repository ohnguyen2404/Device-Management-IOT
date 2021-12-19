const tenantController = require('../controllers').tenant
const {validator, authJwt} = require('../middleware')
const constants = require('../helpers/constant')

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow_Headers",
      `${constants.TOKEN_HEADER}, Origin, Content-Type, Accept`
    )
    next();
  })
 
  app.get(
    "/tenants",
    [
      authJwt.verifyToken,
      authJwt.isTenantOrAdmin
    ],
    tenantController.getAllTenants)
  app.get(
    "/tenants/:tenantId",
    [
      authJwt.verifyToken,
      authJwt.isTenantOrAdmin
    ],
    tenantController.getTenant
    )
  app.put(
    "/tenants/:tenantId",
    [
      authJwt.verifyToken,
      authJwt.isAdmin
    ],
    tenantController.updateTenant)
  app.delete(
    "/tenants/:tenantId",
    [
      authJwt.verifyToken,
      authJwt.isAdmin
    ],
    tenantController.deleteTenant)
  
  app.post(
    "/tenant",
    [
      authJwt.verifyToken,
      authJwt.isTenantOrAdmin,
      validator.validateField("email"),
      validator.validateAuthorities
    ],
    tenantController.createTenant)

  // Public end-point for register tenant after register new account
  app.post(
    "/auth/register-tenant",
    [
      validator.validateField("email")
    ],
    tenantController.registerTenant)
}