const validate = require("validate.js")
const { User, Device, Customer, Tenant } = require("../models")
const uuidValidate = require("uuid")

const { StatusCodes, getReasonPhrase } = require("http-status-codes")

const constraint = {
  email: {
    presence: true,
    email: true
  },

  password: {
    presence: true,
    length: {
      minimum: 6
    }
  },

  confirmPassword: {
    equality: "password" // this field need to equal to 'password'
  },

  username: {
    presence: true,
    length: {
      minimum: 3
    },
    format: {
      pattern: "[a-z0-9]+", // Allow only a-z and 0-9
      flags: "i", // Allow upper/lowercase,
      message: "Username can only contain a-z and 0-9"
    }
  }
}

validateField = (field) => {
  return (req, res, next) => {
    const error = validate.single(req.body[field], constraint[field])
    if (!error) {
      next()
      return
    }
    res.status(400).send({ message: req.body[field] + " " + error })
  }
}

validateUUID = (uuid, res) => {
  if (!uuidValidate.validate(uuid)) {
    res.status(400).send({
      message: `Wrong UUID format!`,
      HttpStatus: getReasonPhrase(StatusCodes.BAD_REQUEST),
      statusValue: StatusCodes.BAD_REQUEST,
      timestamp: new Date().toISOString(),
    })
    return false
  }

  return true
}

checkExistedDeviceId = async (req, res, next) => {
  const deviceId = req.params.deviceId
  if (!validateUUID(deviceId, res)) {
    return
  }
  
  const device = await Device.findByPk(deviceId)

  if (!device) {
    res.status(400).send({
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
    res.status(500).send({
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
    res.status(500).send({
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
}

module.exports = validator
