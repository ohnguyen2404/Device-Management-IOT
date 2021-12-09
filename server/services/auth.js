const jwtService = require("../services/jwt")
const bcrypt = require("bcryptjs")
//const sequelize = require('sequelize')

const{User, Role, User_Role, } = require('../models')

const AuthService = {
  async register (email, password, roles) {
    try {
      const validRoles = await Role.findAll({
        where: {name: roles},
        raw: true
      })

      const newUser = await User.create({
        email,
        password: bcrypt.hashSync(password, 8),
      })

      validRoles.forEach(async (role) => {
        await User_Role.create({
          user_id: newUser.id,
          role_id: role.id
        })
      })
    }
    catch (err) {
      console.log(err)
      return false
    }

    return true
  },

  async login (email, password) {
    const user = await User.findOne({
      where: {
        email
      },
      include: {
        model: Role
      },
    })

    const userRoles = []
    user.roles.forEach(role => {
      userRoles.push(role.name)
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

    return {
      status: 200,
      id: user.id,
      email: user.email,
      roles: userRoles,
      accessToken: token
    }
  }

}

module.exports = AuthService