const AuthService = require("../services/auth")

module.exports = {
  // signup
  async signup (req, res) {
    const {username, email, password} = req.body
    const role = req.body.role || 'USER'
    const result = await AuthService.signUp(username, email, password, role)
    
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