const jwtService = require('../services/jwt')
const {StatusCodes, getReasonPhrase} = require('http-status-codes')
const constants = require('../helpers/constant')

checkRoleExist = (userRoles, checkRole) => {
  userRoles.forEach(role => {
    if (role === checkRole) return true
  })

  return false
}

verifyToken = (req, res, next) => {
  let token = req.headers[constants.TOKEN_HEADER.toLowerCase()]

  if (!token) {
    return res.status(StatusCodes.FORBIDDEN).send({
      message: "No token provided!"
    })
  }

  if (token.startsWith("Bearer ")){
    token = token.substring(7, token.length);
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
    : res.status(StatusCodes.FORBIDDEN).send({message: "Require Tenant role!"}) 
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
