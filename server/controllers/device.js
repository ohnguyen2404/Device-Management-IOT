const DeviceService = require('../services/device')
const {StatusCodes, getReasonPhrase} = require('http-status-codes')

module.exports = {
  async getAllDevices(req, res) {
    const {tenantId, customerId} = req.body

    const result = await DeviceService.getAll(tenantId, customerId)

    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: "Can not get devices!",
        status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString()
      })
      return
    }

    res.status(StatusCodes.OK).send(result)
  },

  async getDevice(req, res) {
    const deviceId = req.params.deviceId
    const result = await DeviceService.getById(deviceId)

    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: `Can not get device with UUID: ${deviceId}!`,
        status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString()
      })
      return
    }

    res.status(StatusCodes.OK).send(result)
  },

  async createDevice(req, res) {
    const options = req.body
    const {userId, authorities} = req
    const result = await DeviceService.create({userId, authorities}, options)

    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: "Can not create device!",
        status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString()
      })
      return
    }

    res.status(StatusCodes.OK).send({
      message: "Create device successfully!"
    })
  },

  async updateDevice(req, res) {
    const deviceId = req.params.deviceId
    const {userId} = req
    const options = req.body

    const result = await DeviceService.update(deviceId, userId, options)
    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: "Can not update device!",
        status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString()
      })
      return
    }
    res.status(StatusCodes.OK).send({
      message: "Update device successfully!"
    })
  },

  async removeDevice(req, res) {
    const deviceId = req.params.deviceId

    const result = await DeviceService.delete(deviceId)
    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: "Can not delete device!",
        status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
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