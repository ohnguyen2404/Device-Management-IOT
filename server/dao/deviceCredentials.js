const { Op } = require("sequelize");
const { DeviceCredentials } = require("../models");

const DeviceCredentialsDAO = {
  async get(deviceId) {
    try {
      return await DeviceCredentials.findByPk(deviceId);
    } catch (e) {
      console.log("error", e.message);
      return false;
    }
  },

  async create(options) {
    console.log("options", options);
    try {
      return await DeviceCredentials.create({
        ...options,
      });
    } catch (e) {
      console.log("error", e.message);
      return false;
    }
  },

  async update(deviceId, options) {
    console.log("options", options);
    try {
      await DeviceCredentials.update(
        { ...options },
        { where: { id: deviceId } }
      );
      return true;
    } catch (e) {
      console.log("error", e.message);
      return false;
    }
  },
};

module.exports = DeviceCredentialsDAO;
