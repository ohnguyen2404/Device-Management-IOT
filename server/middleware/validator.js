const validate = require("validate.js")
const { User, Device, Customer, Tenant } = require("../models")
const uuidValidate = require("uuid")

const { StatusCodes, getReasonPhrase } = require("http-status-codes")
const { AUTHORITIES } = require("../helpers/constant")

const constraint = {
  email: {
    presence: true,
    email: true
  },

  password: {
    presence: true,
    length: {
      minimum: 6,
      message: 'must be at least 6 characters'
    }
  },

  confirmPassword: {
    equality: "password" // this field need to equal to 'password'
  },

  username: {
    presence: true,
    length: {
      minimum: 3,
      message: 'must be at least 3 characters'
    },
    format: {
      pattern: "[a-z0-9]+", // Allow only a-z and 0-9
      flags: "i", // Allow upper/lowercase,
      message: "Username can only contain a-z and 0-9"
    }
  },
}

validateField = (field) => {
  return (req, res, next) => {
    const error = validate.single(req.body[field], constraint[field])
    if (!error) {
      next()
      return
    }
    res.status(StatusCodes.BAD_REQUEST).send({ message: req.body[field] + " " + error })
  }
}

validateUUID = (uuid, res) => {
  if (!uuidValidate.validate(uuid)) {
    res.status(StatusCodes.BAD_REQUEST).send({
      message: `Wrong UUID format!`,
      status: getReasonPhrase(StatusCodes.BAD_REQUEST),
      statusValue: StatusCodes.BAD_REQUEST,
      timestamp: new Date().toISOString(),
    })
    return false
  }

  return true
}

validateAuthorities = async (req, res, next) => {
  const authorities = req.body.authorities;

  if (authorities.length === 0) {
    res.status(StatusCodes.BAD_REQUEST).send({ message: authorities + " is empty"})
    return
  }

  for(let i = 0; i < authorities.length; i++) {
    let authority = authorities[i]

    if (AUTHORITIES.find(auth => auth === authority) === undefined) { 
      res.status(StatusCodes.BAD_REQUEST).send({ message: authorities + " is invalid"})
      return
    }
  }
  next()
}

const validator = {
  validateField: validateField,
  validateAuthorities: validateAuthorities
}

module.exports = validator
