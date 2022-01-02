const jwtService = require('../services/jwt')
const {StatusCodes, getReasonPhrase} = require('http-status-codes')
const constant = require('../helpers/constant')
const CustomerDAO = require('../dao/customer')
const TenantDAO = require('../dao/tenant')

checkRoleExist = (userRoles, checkRole) => {
  let isCheck = false
  if (!userRoles) {
    return false
  }
  userRoles.forEach(role => {
    if (role === checkRole) {
      isCheck = true
    }
  })

  return isCheck
}

verifyToken = async (req, res, next) => {
  let token = req.headers[constant.TOKEN_HEADER.toLowerCase()]
  if (!token) {
    return res.status(StatusCodes.FORBIDDEN).send({
      message: "No token provided!"
    })
  }

  if (token.startsWith(constant.TOKEN_START)){
    token = token.substring(constant.TOKEN_START.length, token.length);
  } 
  else {
    return res.status(StatusCodes.FORBIDDEN).send({
      message: "Wrong token type provided!"
    })
  }

  const verifyOptions = {
    issuer: process.env.JWT_ISSUER,
  }
  const legit = jwtService.verify(token, verifyOptions)
  if (!legit) {
    return res.status(StatusCodes.UNAUTHORIZED).send({message: "Unauthorized!"});
  }

  const {sub, authorities} = jwtService.decode(token).payload
  if (!sub || !authorities) {
    return res.status(StatusCodes.FORBIDDEN).send({
      message: "Missing attribute sub or authorities from token!"
    })
  }

  // We will get tenantId and/or customerId of the user here for further processing
  let tenantId = null
  let customerId = null
  let isAdmin = false
  if (checkRoleExist(authorities, constant.ROLE_ADMIN)) {
    isAdmin = true
  }

  console.log('sub', sub);
  if (checkRoleExist(authorities, constant.ROLE_TENANT)) {
    const userTenant = await TenantDAO.getByUserId(sub)
    if (!userTenant) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: "Can't find tenant information with provided token."
      })
    }
    tenantId = userTenant.id
  }

  if (checkRoleExist(authorities, constant.ROLE_CUSTOMER)) {
    const userCustomer = await CustomerDAO.getByUserId(sub)
    if (!userCustomer) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: "Can't find customer information with provided token."
      })
    }
    customerId = userCustomer.id
  }

  req.isAdmin = isAdmin
  req.tenantId = tenantId
  req.customerId = customerId
  req.userId = sub
  req.authorities = authorities
  req.token = token

  next()
}

isAdmin = async (req, res, next) => {
  let isValid = checkRoleExist(req.authorities, constant.ROLE_ADMIN)
  isValid
    ? next()
    : res.status(StatusCodes.FORBIDDEN).send({message: "Require Admin role!"}) 
}

isTenantOrAdmin = async (req, res, next) => {
  let isValid = 
    checkRoleExist(req.authorities, constant.ROLE_ADMIN) ||
    checkRoleExist(req.authorities, constant.ROLE_TENANT)

  isValid
    ? next()
    : res.status(StatusCodes.FORBIDDEN).send({message: "Require Tenant Or Admin role!"}) 
}

isCustomer = async (req, res, next) => {
  let isValid = checkRoleExist(req.authorities, constant.ROLE_CUSTOMER)

  isValid
    ? next()
    : res.status(StatusCodes.FORBIDDEN).send({message: "Require Customer role!"}) 
}

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isTenantOrAdmin: isTenantOrAdmin,
  isCustomer: isCustomer
}

module.exports = authJwt;
