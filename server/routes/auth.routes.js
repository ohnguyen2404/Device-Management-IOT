const {verifySignUp, validator} = require('../middleware')
const authController = require('../controllers/auth')

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow_Headers",
      "x-access-token, Origin, Content-Type, Accept"
    )
    next();
  })

  app.post(
    "/auth/register",
    [
      validator.validateField('username'),
      validator.validateField('email'),
      validator.validateField('password'),
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    authController.signup
  )

  app.post(
    "/auth/login",
    authController.signin
  )

  
}