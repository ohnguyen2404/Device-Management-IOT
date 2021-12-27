const DeviceCredentialsService = require('../services/deviceCredentials')
const {StatusCodes, getReasonPhrase} = require('http-status-codes')

module.exports = {
  async validateToken(req, res) {
    const deviceToken = req.params.deviceToken

    const result = await DeviceCredentialsService.validateToken(deviceToken)

    if (!result) {
      res.status(StatusCodes.BAD_REQUEST).send(false)
      return
    }

    res.status(StatusCodes.OK).send(true)
  },

  async updateCredentials(req, res) {
    const deviceId = req.params.deviceId
    const options = req.body
    const result = await DeviceCredentialsService.update(deviceId, options)
    if (!result) {
      res.status(StatusCodes.BAD_REQUEST).send(false)
      return
    }

    res.status(StatusCodes.OK).send({message: "Update credentials successfully!"})
  }

}