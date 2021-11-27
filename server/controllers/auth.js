const config = require("../config/auth.config")
const db = require("../models")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const User = db.User

module.exports = {
  // signup
  async signup (req, res) {
    const {username, email, password, role} = req.body
    const user = await User.create({
      username,
      email,
      password: bcrypt.hashSync(password, 8),
      role
    })

    role ? user.update(role) : user.update({role: "USER"})

    res.status(200).send("User registered success!")

  },

  // signin
  async signin (req, res) {
    const {username, password} = req.body
    const user = await User.findOne({
      where: {
        username
      }
    })
    if (!user) {
      return res.status(404).send({message: "User not found"})
    }

    const passwordIsValid = bcrypt.compareSync(
      password,
      user.password
    )

    if (!passwordIsValid) {
      return res.status(401).send({
        accesssToken: null,
        message: "Invalid password"
      })
    }

    const token = jwt.sign({id: user.id}, config.secret, {
      expiresIn: 86400 // 24 hrs
    })

    const userRole = user.role

    res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      role: userRole,
      accessToken: token
    })
    

  }
}