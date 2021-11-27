const User = require("../models").User;

module.exports = {
  // User's CRUD
  async create(req, res) {
    const { username, email, password } = req.body;
    try {
      await User.create({ username, email, password });
    } catch (err) {
      console.log(err);
      res.status(400).send("User added failed");
    }

    res.status(200).send("User added success !");
  },

  async update(req, res) {
    const user = await User.findByPk(req.params.userId);
    if (!user) {
      res.status(400).send("User not found");
      return;
    }
    await user.update({ ...req.body });
    res.status(200).send("User updated success !");
  },

  async delete(req, res) {
    const user = await User.findByPk(req.params.userId);
    if (!user) {
      res.status(400).send("User not found");
      return;
    }
    await user.destroy();

    res.status(200).send("User deleted success !");
  },

  // Auth test
  allAccess(req, res) {
    res.status(200).send("Public content");
  },

  userBoard(req, res) {
    res.status(200).send("User content");
  },

  adminBoard(req, res) {
    res.status(200).send("Admin content");
  },
};
