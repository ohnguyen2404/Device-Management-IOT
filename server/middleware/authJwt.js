const jwtService = require('../services/jwt')
const db = require('../models');
const { Role } = require('../models');
const User = db.User

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"]

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    })
  }

  const verifyOptions = {
    issuer: process.env.JWT_ISSUER,
    subject: process.env.JWT_SUBJECT_SIGN_IN,
    audience: process.env.JWT_AUDIENCE
  }

  const legit = jwtService.verify(token, verifyOptions)
  if (!legit) {
    return res.status(401).send({message: "Unauthorized!"});
  }
  
  req.userId = jwtService.decode(token).payload.id
  next()

}

isAdmin = async (req, res, next) => {
  const user = await User.findByPk(req.userId, {
    include: {
      model: Role
    }
  })

  let isAdmin = false
  user.roles.forEach((role) => {
    if (role.name === "ADMIN") {
      isAdmin = true
    }
  })

  isAdmin
  ? next()
  : res.status(403).send({message: "Require Admin role!"}) 
}

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin
}

module.exports = authJwt;
