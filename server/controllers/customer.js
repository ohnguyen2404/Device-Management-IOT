const CustomerService = require('../services/customer')
const {StatusCodes, getReasonPhrase} = require('http-status-codes')

module.exports = {
  async getAllCustomers(req, res) {
    const {tenantId} = req.body

    const result = await CustomerService.getAll(tenantId)

    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: "Can not get customers!",
        HttpStatus: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString()
      })
      return
    }

    res.status(StatusCodes.OK).send(result)
  },

  async getCustomer(req, res) {
    const customerId = req.params.customerId
    const result = await CustomerService.get(customerId)

    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: `Can not get customer with UUID: ${customerId}!`,
        HttpStatus: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString()
      })
      return
    }

    res.status(StatusCodes.OK).send(result)
  },

  async createCustomer(req, res) {
    const options = req.body
    const result = await CustomerService.create(req.userId, options, req.token)

    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: "Can not create customer!",
        HttpStatus: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString()
      })
      return
    }

    res.status(StatusCodes.OK).send({
      message: "Create customer successful!"
    })
  },

  async updateCustomer(req, res) {
    const customerId = req.params.customerId
    const options = req.body
    const result = await CustomerService.update(customerId, options)
    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: "Can not update customer!",
        HttpStatus: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString()
      })
      return
    }
    res.status(StatusCodes.OK).send({
      message: "Update customer successful!"
    })
  },

  async removeCustomer(req, res) {
    const customerId = req.params.customerId

    const result = await CustomerService.delete(customerId)
    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: "Can not delete customer!",
        HttpStatus: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString()
      })
      return
    } 
    
    res.status(StatusCodes.OK).send({
      message: "Delete customer successful!"
    })
  }
}