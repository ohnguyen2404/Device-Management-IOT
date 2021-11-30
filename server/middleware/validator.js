const validate = require('validate.js')

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
    
    res.status(400).send({message: req.body[field] + " " + error})
  }
}

const validator = {
  validateField: validateField
}

module.exports = validator