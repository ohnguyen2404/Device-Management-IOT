const deviceController = require('../controllers').device
const {validator, authJwt} = require('../middleware')
const constants = require('../../constant')

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
      authJwt.verifyToken,
      validator.checkExistedDeviceId
    ],
    deviceController.getDevice)
  app.put(
    "/devices/:deviceId",
    [
      authJwt.verifyToken,
      authJwt.isTenantOrAdmin,
      validator.checkExistedDeviceId
    ],
    deviceController.updateDevice)
  app.delete(
    "/devices/:deviceId",
    [
      authJwt.verifyToken,
      authJwt.isTenantOrAdmin,
      validator.checkExistedDeviceId
    ],
    deviceController.removeDevice)
  
  app.post(
    "/device",
    [
      authJwt.verifyToken,
      authJwt.isTenantOrAdmin
    ],
    deviceController.createDevice)
}