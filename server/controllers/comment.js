const Comment = require("../models").Comment

module.exports = {
  async create(req, res) {
    const {content, userId, postId} = req.body
    return Comment.create({
      content,
      userId,
      postId
    })
  }
}