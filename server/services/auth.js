const jwtService = require("../services/jwt")
const bcrypt = require("bcryptjs")

const User = require('../models').User

const AuthService = {
  async signUp (username, email, password, role) {
    try {
      await User.create({
        username,
        email,
        password: bcrypt.hashSync(password, 8),
        role
      })
    }
    catch (err) {
      console.log(err)
      return false
    }

    return true
  },

  async signIn (username, password) {
    const user = await User.findOne({
      where: {
        username
      }
    })

    if (!user) {
      return {
        status: 404,
        message: "User not found"
      }
    }

    const passwordIsValid = bcrypt.compareSync(
      password,
      user.password
    )
 
    if (!passwordIsValid) {
      return {
        status:401,
        message: "Invalid password",
        accessToken: null
      }
    }

    const signOptions = {
      issuer: process.env.JWT_ISSUER,
      subject: process.env.JWT_SUBJECT_SIGN_IN,
      audience: process.env.JWT_AUDIENCE
    }

    const token = jwtService.sign({id: user.id}, signOptions)
    const userRole = user.role

    return {
      status: 200,
      id: user.id,
      username: user.username,
      email: user.email,
      role: userRole,
      accessToken: token
    }
  }

}

module.exports = AuthService