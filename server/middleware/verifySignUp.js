const {User, Role} = require('../models')
const {Op} = require("sequelize")
const {StatusCodes, getReasonPhrase} = require('http-status-codes')

checkDuplicateEmail = async (req, res, next) => {
  const user = await User.findOne({
    where: {
      email: req.body.email
    }
  })

  if (user) {
    res.status(400).send({
      message: "Register fail! Email is already in use.",
      HttpStatus: getReasonPhrase(StatusCodes.BAD_REQUEST),
      statusValue: StatusCodes.BAD_REQUEST,
      timestamp: new Date().toISOString()
    })
    return
  }

  next()
}

checkRolesExisted = async (req, res, next) => {
  const {roles} = req.body
  let isValidRole = true
  if (roles) {
    roles.forEach((role) => {
      if (!Role.defaultRoles.includes(role)) {
        res.status(400).send({
          message: "Register fail! Invalid roles.",
          HttpStatus: getReasonPhrase(StatusCodes.BAD_REQUEST),
          statusValue: StatusCodes.BAD_REQUEST,
          timestamp: new Date().toISOString()        
        })
        isValidRole = false
      }
    })
  }
  
  isValidRole && next()
}

const verifySignUp = {
  checkDuplicateEmail: checkDuplicateEmail,
  checkRolesExisted: checkRolesExisted
}

module.exports = verifySignUp;
