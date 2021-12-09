const jwtService = require("../services/jwt")
const bcrypt = require("bcryptjs")
//const sequelize = require('sequelize')

const{User, Role, User_Role, } = require('../models')

const AuthService = {
  async register (username, email, password, roles) {
    try {
      //const validRoles = await Role.findAll({
      //  where: {name: roles},
      //  raw: true
      //})

      //const newUser = await User.create({
      //  username,
      //  email,
      //  password: bcrypt.hashSync(password, 8),
      //})

      //validRoles.forEach(async (role) => {
      //  await User_Role.create({
      //    userId: newUser.id,
      //    roleId: role.id
      //  })
      //})
      console.log('REGISTEREDDDDD');
    }
    catch (err) {
      console.log(err)
      return false
    }

    return true
  },

  async login (username, password) {
    const user = await User.findOne({
      where: {
        username
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
      username: user.username,
      email: user.email,
      roles: userRoles,
      accessToken: token
    }
  }

}

module.exports = AuthService