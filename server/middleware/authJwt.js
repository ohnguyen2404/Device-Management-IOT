const jwtService = require('../services/jwt')
const {StatusCodes, getReasonPhrase} = require('http-status-codes')
const constants = require('../helpers/constant')

checkRoleExist = (userRoles, checkRole) => {
  let isCheck = false
  userRoles.forEach(role => {
    if (role === checkRole) {
      isCheck = true
    }
  })

  return isCheck
}

verifyToken = (req, res, next) => {
  let token = req.headers[constants.TOKEN_HEADER.toLowerCase()]
  if (!token) {
    return res.status(StatusCodes.FORBIDDEN).send({
      message: "No token provided!"
    })
  }

  if (token.startsWith(constants.TOKEN_START)){
    token = token.substring(constants.TOKEN_START.length, token.length);
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

  req.userId = sub
  req.authorities = authorities
  req.token = token
  console.log('authorities', authorities);
  next()
}

isAdmin = async (req, res, next) => {
  let isValid = checkRoleExist(req.authorities, "ADMIN")
  isValid
    ? next()
    : res.status(StatusCodes.FORBIDDEN).send({message: "Require Admin role!"}) 
}

isTenantOrAdmin = async (req, res, next) => {
  let isValid = 
    checkRoleExist(req.authorities, "ADMIN") ||
    checkRoleExist(req.authorities, "TENANT")

  isValid
    ? next()
    : res.status(StatusCodes.FORBIDDEN).send({message: "Require Tenant Or Admin role!"}) 
}

isCustomer = async (req, res, next) => {
  let isValid = checkRoleExist(req.authorities, "CUSTOMER")

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
