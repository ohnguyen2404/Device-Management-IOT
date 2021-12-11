const AuthService = require("../services/auth")
const {StatusCodes, getReasonPhrase} = require('http-status-codes')

module.exports = {
  // register
  async register (req, res) {
    const {email, password} = req.body
    const roles = req.body.roles || ['USER']
    const result = await AuthService.register(email, password, roles)
    
    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: "User register failed!",
        HttpStatus: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString()
      })
      return
    }

    res.status(StatusCodes.OK).send({message: "User registered success!"})

  },

  // login
  async login (req, res) {
    const {email, password} = req.body
    const result = await AuthService.login(email, password)

    res.status(result.status).send(result)
  }
}