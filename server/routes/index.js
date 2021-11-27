const userController = require('../controllers').users
const postController = require('../controllers').posts
const commentController = require('../controllers').comments
const authRoutes = require('./auth.routes')
const userRoutes = require('./user.routes')

module.exports = (app) => {
  authRoutes(app),
  userRoutes(app)
}