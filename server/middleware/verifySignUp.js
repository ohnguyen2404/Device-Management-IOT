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
    res.status(400).send({message: "Register fail! Username or Email is already in use."})
    return
  }

  next()
}

checkRolesExisted = (req, res, next) => {
  const {roles} = req.body
  if (roles) {
    roles.forEach((role) => {
      
      if (!Role.defaultRoles.includes(role)) {
        res.status(400).send({
          message: "Register failed! Role does not exist: " + role
        })
        return
      }
    })
  }
  
  next()
}

const verifySignUp = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
  checkRolesExisted: checkRolesExisted
}

module.exports = verifySignUp;
