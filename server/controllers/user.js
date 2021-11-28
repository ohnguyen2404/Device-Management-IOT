const User = require("../models").User;
const UserService = require("../services/user")

module.exports = {
  // User's CRUD
  async create(req, res) {
    const user = req.body;
    try {
      await UserService.createUser(user)
    } 
    catch (err) {
      res.status(400).send("User added failed")
    }

    res.status(200).send("User added success !")
  },

  async update(req, res) {
    const result = await UserService.updateUser(req.params.userId, req.body)
    if (!result) {
      res.status(400).send("User not found")
      return
    }
    res.status(200).send("User updated success !")
  },

  async delete(req, res) {
    const result = await UserService.deleteUser(req.params.userId);
    if (!result) {
      res.status(400).send("User not found")
      return
    }

    res.status(200).send("User deleted success !")
  },

  // Auth test
  allAccess(req, res) {
    res.status(200).send("Public content")
  },

  userBoard(req, res) {
    res.status(200).send("User content")
  },

  adminBoard(req, res) {
    res.status(200).send("Admin content")
  },

};
