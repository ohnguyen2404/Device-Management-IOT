const {authJwt} = require("../middleware")
const deviceController = require('../controllers').device

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow_Headers",
      "x-access-token, Origin, Content-Type, Accept"
    )
    next();
  })

  //app.get("/api/test/all", userController.allAccess)

  //app.get(
  //  "/api/test/user",
  //  [authJwt.verifyToken],
  //  userController.userBoard
  //)

  //app.get(
  //  "/api/test/admin",
  //  [authJwt.verifyToken, authJwt.isAdmin],
  //  userController.adminBoard
  //)
 
  app.get("/devices", deviceController.getAllDevices)
  app.post("/device", deviceController.createDevice)
  app.put("/device/:deviceId", deviceController.updateDevice)
  app.delete("/device/:deviceId", deviceController.removeDevice)
}