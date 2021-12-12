const {verifySignUp, validator} = require('../middleware')
const authController = require('../controllers/auth')
const constants = require('../../constant')

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow_Headers",
      `${constants.TOKEN_HEADER}, Origin, Content-Type, Accept`
    )
    next();
  })

  app.post(
    "/auth/register",
    [
      verifySignUp.checkDuplicateEmail,
      verifySignUp.checkRolesExisted,
      validator.validateField('email'),
      validator.validateField('password'),
    ],
    authController.register
  )

  app.post(
    "/auth/login",
    authController.login
  )

  
}