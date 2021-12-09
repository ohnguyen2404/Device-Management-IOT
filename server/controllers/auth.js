const AuthService = require("../services/auth")
const {StatusCodes, getReasonPhrase} = require('http-status-codes')
const { now } = require("sequelize/dist/lib/utils")

module.exports = {
  // signup
  async signup (req, res) {
    const {username, email, password} = req.body
    const roles = req.body.roles || ['USER']
    const result = await AuthService.signUp(username, email, password, roles)
    
    if (!result) {
      res.status(500).send({
        message: "User register failed!",
        HttpStatus: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date.toISOString()
      })
      return
    }

    res.status(200).send({message: "User registered success!"})

  },

  // signin
  async signin (req, res) {
    const {username, password} = req.body
    const result = await AuthService.signIn(username, password)

    res.status(result.status).send(result)
  }
}