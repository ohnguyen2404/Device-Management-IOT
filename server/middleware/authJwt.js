const jwtService = require('../services/jwt')
const {StatusCodes, getReasonPhrase} = require('http-status-codes')
const constants = require('../../constant')

verifyToken = (req, res, next) => {
  let token = req.headers[constants.TOKEN_HEADER.toLowerCase()]
  if (token.startsWith("Bearer ")){
    token = token.substring(7, token.length);
  } 
  else {
    return res.status(StatusCodes.FORBIDDEN).send({
      message: "Wrong token type provided!"
    })
  }

  if (!token) {
    return res.status(StatusCodes.FORBIDDEN).send({
      message: "No token provided!"
    })
  }

  const verifyOptions = {
    issuer: process.env.JWT_ISSUER,
  }

  const legit = jwtService.verify(token, verifyOptions)
  if (!legit) {
    return res.status(StatusCodes.UNAUTHORIZED).send({message: "Unauthorized!"});
  }

  req.userId = jwtService.decode(token).payload.sub
  req.authorities = jwtService.decode(token).payload.authorities

  next()
}

isAdmin = async (req, res, next) => {
  let isValid = false
  req.authorities.forEach((role) => {
    if (role === "ADMIN") {
      isValid = true
    }
  })

  isValid
  ? next()
  : res.status(StatusCodes.FORBIDDEN).send({message: "Require Admin role!"}) 
}

isTenantOrAdmin = async (req, res, next) => {
  let isValid = false

  req.authorities.forEach((role) => {
    if (role === "TENANT" || role === "ADMIN") {
      isValid = true
    }
  })

  isValid
  ? next()
  : res.status(StatusCodes.FORBIDDEN).send({message: "Require Tenant role!"}) 
}

isCustomer = async (req, res, next) => {
  let isValid = false

  req.authorities.forEach((role) => {
    if (role === "CUSTOMER") {
      isValid = true
    }
  })

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
