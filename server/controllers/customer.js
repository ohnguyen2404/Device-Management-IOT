const CustomerService = require('../services/customer')
const {StatusCodes, getReasonPhrase} = require('http-status-codes')

module.exports = {
  async getCustomers(req, res) {
    const {authorities, tenantId, customerId} = req
    const result = await CustomerService.getAll({authorities, tenantId, customerId})

    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: "Can not get customers!",
        status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
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
        status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString()
      })
      return
    }

    res.status(StatusCodes.OK).send(result)
  },

  async createCustomer(req, res) {
    const options = req.body
    const {tenantId, customerId, authorities} = req
    const result = await CustomerService.create({tenantId, customerId, authorities}, options, req.token)

    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: "Can not create customer!",
        status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
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
    const result = await CustomerService.update(customerId, options, req.token)
    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: "Can not update customer!",
        status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString()
      })
      return
    }
    res.status(StatusCodes.OK).send({
      message: "Update customer successful!"
    })
  },

  async deleteCustomer(req, res) {
    const customerId = req.params.customerId

    const result = await CustomerService.delete(customerId)
    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: "Can not delete customer!",
        status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
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