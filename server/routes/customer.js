const customerController = require('../controllers').customer
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
    "/customers",
    [
      authJwt.verifyToken,
      authJwt.isTenantOrAdmin
    ],
    customerController.getAllCustomers)
  app.get(
    "/customers/:customerId",
    [
      authJwt.verifyToken
    ],
    customerController.getCustomer)
  app.put(
    "/customers/:customerId",
    [
      authJwt.verifyToken,
      authJwt.isTenantOrAdmin
    ],
    customerController.updateCustomer)
  app.delete(
    "/customers/:customerId",
    [
      authJwt.verifyToken,
      authJwt.isAdmin
    ],
    customerController.removeCustomer)
  
  app.post(
    "/customer",
    [
      authJwt.verifyToken,
      authJwt.isTenantOrAdmin
    ],
    customerController.createCustomer)
}