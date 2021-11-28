const config = require("../config/auth.config")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const User = require('../models').User

const AuthService = {
  async signUp (body) {
    const {username, email, password, role} = body
    const user = await User.create({
      username,
      email,
      password: bcrypt.hashSync(password, 8),
      role
    })

    role ? user.update(role) : user.update({role: "USER"})
  },

  async signIn (body) {
    const {username, password} = body
    let result
    const user = await User.findOne({
      where: {
        username
      }
    })

    if (!user) {
      result = {
        status: 404,
        message: "User not found"
      }

      return result
    }

    const passwordIsValid = bcrypt.compareSync(
      password,
      user.password
    )

    if (!passwordIsValid) {
      result = {
        status:401,
        message: "Invalid password",
        accesssToken: null
      }

      return result
    }

    const token = jwt.sign({id: user.id}, config.secret, {
      expiresIn: 86400 // 24 hrs
    })

    const userRole = user.role
    result = {
      status: 200,
      id: user.id,
      username: user.username,
      email: user.email,
      role: userRole,
      accesssToken: token
    }

    return result
  }

}

module.exports = AuthService