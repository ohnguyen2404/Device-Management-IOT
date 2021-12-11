const deviceController = require('../controllers').device
const {validator} = require('../middleware')

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow_Headers",
      "x-access-token, Origin, Content-Type, Accept"
    )
    next();
  })
 
  app.get(
    "/devices",
    [
      
    ],
    deviceController.getAllDevices)
  app.get(
    "/devices/:deviceId",
    [
      validator.checkExistedDeviceId
    ],
    deviceController.getDevice)
  app.put("/devices/:deviceId", deviceController.updateDevice)
  app.delete("/devices/:deviceId", deviceController.removeDevice)
  
  app.post("/device", deviceController.createDevice)
}