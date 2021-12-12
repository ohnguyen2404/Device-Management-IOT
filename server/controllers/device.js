const DeviceService = require('../services/device')
const {StatusCodes, getReasonPhrase} = require('http-status-codes')

module.exports = {
  async getAllDevices(req, res) {
    const {tenantId, customerId} = req.body

    const result = await DeviceService.getAll(tenantId, customerId)

    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: "Can not get devices!",
        HttpStatus: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString()
      })
      return
    }

    res.status(StatusCodes.OK).send(result)
  },

  async getDevice(req, res) {
    const deviceId = req.params.deviceId
    const result = await DeviceService.get(deviceId)

    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: `Can not get device with UUID: ${deviceId}!`,
        HttpStatus: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString()
      })
      return
    }

    res.status(StatusCodes.OK).send(result)
  },

  async createDevice(req, res) {
    const {tenantId, ...options} = req.body
    const result = await DeviceService.create(tenantId, options)

    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: "Can not create device!",
        HttpStatus: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString()
      })
      return
    }

    res.status(StatusCodes.OK).send({
      message: "Create device successful!"
    })
  },

  async updateDevice(req, res) {
    const deviceId = req.params.deviceId
    const options = req.body
    const result = await DeviceService.update(deviceId, options)
    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: "Can not update device!",
        HttpStatus: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString()
      })
      return
    }
    res.status(StatusCodes.OK).send({
      message: "Update device successful!"
    })
  },

  async removeDevice(req, res) {
    const deviceId = req.params.deviceId

    const result = await DeviceService.delete(deviceId)
    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: "Can not delete device!",
        HttpStatus: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString()
      })
      return
    } 
    
    res.status(StatusCodes.OK).send({
      message: "Delete device successful!"
    })
  }
}