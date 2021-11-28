const {User, Role} = require('../models')
const {Op} = require("sequelize")

checkDuplicateUsernameOrEmail = async (req, res, next) => {
  const user = await User.findOne({
    where: {
      [Op.or]: [
        {username: req.body.username},
        {email: req.body.email}
      ]
    }
  })

  if (user) {
    res.status(400).send("Register fail! Username or Email is already in use.")
    return
  }

  next()
}

checkRoleExisted = (req, res, next) => {
  const {role} = req.body
  if (role) {
    if (!Role.defaultRoles.includes(role)) {
      res.status(400).send({
        message: "Register failed! Role does not exist: " + role
      })
      return
    }
  }
  
  next()
}

const verifySignUp = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
  checkRoleExisted: checkRoleExisted
}

module.exports = verifySignUp;
