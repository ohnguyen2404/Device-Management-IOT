const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require('../models');
const User = db.User

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"]

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    })
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({message: "Unauthorized!"});
    }

    req.userId = decoded.id
    next()
  })

}

isAdmin = async (req, res, next) => {
  const user = await User.findByPk(req.userId)
  const userRole = user.role

  if (userRole === "ADMIN") {
    next();
    return;
  }
  
  res.status(403).send({message: "Require Admin role!"})
  return
}

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin
}

module.exports = authJwt;
