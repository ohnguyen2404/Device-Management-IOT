const TenantService = require('../services/tenant')
const {StatusCodes, getReasonPhrase} = require('http-status-codes')

module.exports = {
  async getAllTenants(req, res) {
    const {userId, authorities} = req
    const result = await TenantService.getAll({userId, authorities})

    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: "Can not get tenants!",
        status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString()
      })
      return
    }

    res.status(StatusCodes.OK).send(result)
  },

  async getTenant(req, res) {
    const tenantId = req.params.tenantId
    const result = await TenantService.get(tenantId)

    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: `Can not get tenant with UUID: ${tenantId}!`,
        status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString()
      })
      return
    }

    res.status(StatusCodes.OK).send(result)
  },

  async createTenant(req, res) {
    const options = req.body
    const {userId, authorities} = req
    const result = await TenantService.create({userId, authorities}, options, req.token)

    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: "Can not create tenant!",
        status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString()
      })
      return
    }

    res.status(StatusCodes.OK).send({
      message: "Create tenant successful!"
    })
  },

  async updateTenant(req, res) {
    const tenantId = req.params.tenantId
    const options = req.body
    const result = await TenantService.update(tenantId, options, req.token)
    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: "Can not update tenant!",
        status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString()
      })
      return
    }
    res.status(StatusCodes.OK).send({
      message: "Update tenant successful!"
    })
  },

  async deleteTenant(req, res) {
    const tenantId = req.params.tenantId

    const result = await TenantService.delete(tenantId, req.token)
    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: "Can not delete tenant!",
        status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString()
      })
      return
    } 
    
    res.status(StatusCodes.OK).send({
      message: "Delete tenant successful!"
    })
  },

  async registerTenant(req, res) {
    const {userId, email} = req.body
    const result = await TenantService.register(userId, {email})

    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: "Can not register tenant!",
        status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString()
      })
      return
    }

    res.status(StatusCodes.OK).send({
      message: "Register tenant successful!"
    })
  }
}