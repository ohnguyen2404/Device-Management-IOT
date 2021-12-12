const {authJwt} = require("../middleware")
const userController = require('../controllers').user
const constants = require('../helpers/constant')

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow_Headers",
      `${constants.TOKEN_HEADER}, Origin, Content-Type, Accept`
    )
    next();
  })

  app.get("/api/test/all", userController.allAccess)

  app.get(
    "/api/test/user",
    [authJwt.verifyToken],
    userController.userBoard
  )

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    userController.adminBoard
  )
  
}