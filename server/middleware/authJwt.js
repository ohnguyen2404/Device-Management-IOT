const jwtService = require('../services/jwt')
const db = require('../models');
const User = db.User

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"]

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    })
  }

  const verifyOptions = {
    issuer: 'DeviceManagementIOT',
    subject: 'user_signin',
    audience: 'http://localhost:8000'
  }

  const legit = jwtService.verify(token, verifyOptions)
  if (!legit) {
    return res.status(401).send({message: "Unauthorized!"});
  }
  
  req.userId = jwtService.decode(token).payload.id
  next()

}

isAdmin = async (req, res, next) => {
  const user = await User.findByPk(req.userId)
  const userRole = user.role

  if (userRole === "ADMIN") {
    next()
    return
  }
  
  res.status(403).send({message: "Require Admin role!"})
  return
}

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin
}

module.exports = authJwt;
