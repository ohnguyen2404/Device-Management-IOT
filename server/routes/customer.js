const customerController = require('../controllers').customer
const {validator} = require('../middleware')

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow_Headers",
      "x-access-token, Origin, Content-Type, Accept"
    )
    next();
  })
 
  app.get("/customers", customerController.getAllCustomers)
  app.get(
    "/customers/:customerId",
    [
      validator.checkExistedCustomerId
    ],
    customerController.getCustomer
    )
  app.put("/customers/:customerId", customerController.updateCustomer)
  app.delete("/customers/:customerId", customerController.removeCustomer)
  
  app.post("/customer", customerController.createCustomer)
}