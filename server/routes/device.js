const deviceController = require('../controllers/device')
const deviceCredentialsController = require('../controllers/deviceCredentials')
const {validator, authJwt} = require('../middleware')
const constants = require('../helpers/constant')

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow_Headers",
      `${constants.TOKEN_HEADER}, Origin, Content-Type, Accept`
    )
    next();
  })

  // Device Details

  app.get(
    "/devices",
    [
      authJwt.verifyToken
    ],
    deviceController.getDevices)
  app.get(
    "/devices/:deviceId",
    [
      authJwt.verifyToken
    ],
    deviceController.getDevice)
  app.put(
    "/devices/:deviceId",
    [
      authJwt.verifyToken,
      authJwt.isTenantOrAdmin,
      validator.validateDeviceDetails
    ],
    deviceController.updateDevice)
  app.delete(
    "/devices/:deviceId",
    [
      authJwt.verifyToken,
      authJwt.isTenantOrAdmin
    ],
    deviceController.removeDevice)
  
  app.post(
    "/device",
    [
      authJwt.verifyToken,
      authJwt.isTenantOrAdmin,
      validator.validateDeviceDetails,
    ],
    deviceController.createDevice)

  // Device Credentials
  app.get(
    "/devices/credentials/:deviceId",
    [
      authJwt.verifyToken,
      authJwt.isTenantOrAdmin,
    ],
    deviceCredentialsController.getCredentials
  )

  app.put(
    "/devices/credentials/:deviceId",
    [
      authJwt.verifyToken,
      authJwt.isTenantOrAdmin,
      validator.validateDeviceCredentials
    ],
    deviceCredentialsController.updateCredentials
  )

  // Public API-s for validate device credentials by token value
  app.post(
    "/device/validate",
    [
      validator.validateDeviceToken
    ],
    deviceCredentialsController.validateToken
  )

}