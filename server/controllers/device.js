const DeviceService = require('../services/device')
const {StatusCodes, getReasonPhrase} = require('http-status-codes')

module.exports = {
  async getAllDevices(req, res) {
    const {tenant_id, customer_id} = req.body

    console.log('tenant_id', tenant_id);
    console.log('customer_id', customer_id);

    const result = await DeviceService.getAll(tenant_id, customer_id)

    if (!result) {
      res.status(500).send({
        message: "Can not get devices!",
        HttpStatus: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString()
      })
      return
    }

    res.status(200).send(result)
  },

  async createDevice(req, res) {
    const {tenant_id, ...options} = req.body
    const result = await DeviceService.create(tenant_id, options)

    if (!result) {
      res.status(500).send({
        message: "Can not create device!",
        HttpStatus: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString()
      })
      return
    }

    res.status(200).send({
      message: "Create device successful!"
    })
  },

  async updateDevice(req, res) {
    const deviceId = req.params.deviceId

    const result = await DeviceService.delete(deviceId)
    if (!result) {
      res.status(500).send({
        message: "Can not update device!",
        HttpStatus: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString()
      })
      return
    }
    res.status(200).send({
      message: "Update device successful!"
    })
  },

  async removeDevice(req, res) {
    const deviceId = req.params.deviceId

    const result = await DeviceService.delete(deviceId)
    if (!result) {
      res.status(500).send({
        message: "Can not delete device!",
        HttpStatus: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString()
      })
      return
    } 
    
    res.status(200).send({
      message: "Delete device successful!"
    })
  }
}