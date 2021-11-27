const Post = require("../models").Post

module.exports = {
  async create(req, res) {
    const {title, content, userId} = req.body
    return Post.create({
      title,
      content,
      userId
    })
  }
}