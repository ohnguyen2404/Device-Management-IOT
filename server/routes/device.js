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
 
  app.get(
    "/devices",
    [
      authJwt.verifyToken
    ],
    deviceController.getAllDevices)
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
      validator.validateCreateDeviceInfo
    ],
    deviceController.createDevice)

  app.put(
    "/devices/credentials/:deviceId",
    [
      authJwt.verifyToken,
      authJwt.isTenantOrAdmin,
    ],
    deviceCredentialsController.updateCredentials
  )

  //Public API for validate device credentials by token
  app.get(
    "/device/validate/:deviceToken",
    deviceCredentialsController.validateToken
  )
}