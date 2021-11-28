const AuthService = require("../services/auth")

module.exports = {
  // signup
  async signup (req, res) {

    try {
      await AuthService.signUp(req.body)
    }
    catch (err) {
      res.status(500).send({message: err.message})
    }

    res.status(200).send("User registered success!")

  },

  // signin
  async signin (req, res) {
    const result = await AuthService.signIn(req.body)

    res.status(result.status).send(result)
  }
}