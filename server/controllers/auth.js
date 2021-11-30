const AuthService = require("../services/auth")

module.exports = {
  // signup
  async signup (req, res) {
    const result = await AuthService.signUp(req.body)
    
    if (!result) {
      res.status(500).send({message: "User register failed!"})
      return
    }

    res.status(200).send("User registered success!")

  },

  // signin
  async signin (req, res) {
    const result = await AuthService.signIn(req.body)

    res.status(result.status).send(result)
  }
}