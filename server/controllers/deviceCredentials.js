const DeviceCredentialsService = require('../services/deviceCredentials')
const constant = require('../helpers/constant')
const {StatusCodes, getReasonPhrase} = require('http-status-codes')

module.exports = {
  async validateAccessToken(req, res) {
    const {token} = req.body
    if (!token) {
      res.status(StatusCodes.BAD_REQUEST).send({message: "Empty AccessToken token"})
      return
    }

    const result = await DeviceCredentialsService.
      validateToken(token, constant.DEVICE_CREDENTIALS_TYPE_ACCESS_TOKEN)

    if (!result) {
      res.status(StatusCodes.BAD_REQUEST).send({valid: false})
      return
    }

    res.status(StatusCodes.OK).send({valid: true})
  },

  async validateX509Token(req, res) {
    const {token} = req.body
    if (!token) {
      res.status(StatusCodes.BAD_REQUEST).send({message: "Empty X.509 token"})
      return
    }
    
    const result = await DeviceCredentialsService.
      validateToken(token, constant.DEVICE_CREDENTIALS_TYPE_X_509)

    if (!result) {
      res.status(StatusCodes.BAD_REQUEST).send({valid: false})
      return
    }
    res.status(StatusCodes.OK).send({valid: true})
  },

  async validateMqttBasicToken(req, res) {
    const {token} = req.body
    if (!token) {
      res.status(StatusCodes.BAD_REQUEST).send({message: "Empty MQTT Basic token"})
      return
    }

    const result = await DeviceCredentialsService.
      validateToken(token, constant.DEVICE_CREDENTIALS_TYPE_MQTT_BASIC)

    if (!result) {
      res.status(StatusCodes.BAD_REQUEST).send({valid: false})
      return
    }
    res.status(StatusCodes.OK).send({valid: true})
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