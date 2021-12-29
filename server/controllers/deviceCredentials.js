const DeviceCredentialsService = require('../services/deviceCredentials')
const constant = require('../helpers/constant')
const {StatusCodes, getReasonPhrase} = require('http-status-codes')

module.exports = {
  async validateToken(req, res) {
    const {token, type} = req.body

    const result = await DeviceCredentialsService.validateToken(token, type)

    if (!result) {
      res.status(StatusCodes.OK).send({device: null})
      return
    }

    res.status(StatusCodes.OK).send({device: result})
  },


  async updateCredentials(req, res) {
    const deviceId = req.params.deviceId
    const options = req.body
    const result = await DeviceCredentialsService.update(deviceId, options)
    if (!result) {
      res.status(StatusCodes.BAD_REQUEST).send({message: "Update credentials failed!"})
      return
    }

    res.status(StatusCodes.OK).send({message: "Update credentials successfully!"})
  }

}