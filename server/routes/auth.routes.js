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
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRoleExisted,
      validator.validateField('username'),
      validator.validateField('email'),
      validator.validateField('password')
    ],
    authController.signup
  )

  app.post(
    "/api/auth/signin",
    authController.signin
  )

  
}