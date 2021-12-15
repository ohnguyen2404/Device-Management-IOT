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
      HttpStatus: getReasonPhrase(StatusCodes.BAD_REQUEST),
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

  authorities.forEach(authority => {
    let validAuthority = false
    if (AUTHORITIES.find(auth => auth === authority)) {
      validauthority = true
    }

    if (!validAuthority) {
      res.status(StatusCodes.BAD_REQUEST).send({ message: authorities + " is invalid"})
      return
    }
  })
  next()
}

checkExistedDeviceId = async (req, res, next) => {
  const deviceId = req.params.deviceId
  if (!validateUUID(deviceId, res)) {
    return
  }
  
  const device = await Device.findByPk(deviceId)

  if (!device) {
    res.status(StatusCodes.BAD_REQUEST).send({
      message: `Device with UUID ${deviceId} not found!`,
      HttpStatus: getReasonPhrase(StatusCodes.BAD_REQUEST),
      statusValue: StatusCodes.BAD_REQUEST,
      timestamp: new Date().toISOString(),
    })
    return
  }
  else {
    next()
  }
}

checkExistedCustomerId = async (req, res, next) => {
  const customerId = req.params.customerId
  if (!validateUUID(customerId, res)) {
    return
  }
  
  const customer = await Customer.findByPk(customerId)
  if (!customer) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: `Customer with UUID ${customerId} not found!`,
      HttpStatus: getReasonPhrase(StatusCodes.BAD_REQUEST),
      statusValue: StatusCodes.BAD_REQUEST,
      timestamp: new Date().toISOString(),
    })
    return
  }
  else {
    next()
  }
}

checkExistedTenantId = async (req, res, next) => {
  const tenantId = req.params.tenantId
  if (!validateUUID(tenantId, res)) {
    return
  }

  const tenant = await Tenant.findByPk(tenantId)
  if (!tenant) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: `Tenant with UUID ${tenantId} not found!`,
      HttpStatus: getReasonPhrase(StatusCodes.BAD_REQUEST),
      statusValue: StatusCodes.BAD_REQUEST,
      timestamp: new Date().toISOString(),
    })
    return
  }
  else {
    next()
  }
}

const validator = {
  validateField: validateField,
  checkExistedDeviceId: checkExistedDeviceId,
  checkExistedCustomerId: checkExistedCustomerId,
  checkExistedTenantId: checkExistedTenantId,
  validateAuthorities: validateAuthorities
}

module.exports = validator
