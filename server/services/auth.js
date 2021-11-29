const jwtService = require("../services/jwt")
const bcrypt = require("bcryptjs")

const User = require('../models').User

const AuthService = {
  async signUp (body) {
    const {username, email, password, role} = body
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

    const signOptions = {
      issuer: 'DeviceManagementIOT',
      subject: 'user_signin',
      audience: 'http://localhost:8000'
    }

    const token = jwtService.sign({id: user.id}, signOptions)
    console.log('token', token);

    const userRole = user.role
    result = {
      status: 200,
      id: user.id,
      username: user.username,
      email: user.email,
      role: userRole,
      accesssToken:token
    }

    return result
  }

}

module.exports = AuthService