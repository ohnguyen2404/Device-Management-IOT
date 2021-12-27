const { Op } = require("sequelize");
const { DeviceCredentials } = require("../models");
const constant = require("../helpers/constant");

const DeviceCredentialsDAO = {
  async getByCredentialsId(deviceToken) {
    try {
      return await DeviceCredentials.findOne({
        where: { credentialsId: deviceToken },
      });
    } catch (e) {
      console.log("error", e.message);
      return false;
    }
  },

  async getByCredentialsValue(value, type) {
    try {
      if (type !== constant.DEVICE_CREDENTIALS_TYPE_MQTT_BASIC) {
        return await DeviceCredentials.findOne({
          where: { credentialsValue: value },
        });
      } else {
        const valueObj = JSON.parse(value);
        const qs = `{"clientId":"${valueObj.clientId}"`;

        return await DeviceCredentials.findOne({
          where: {
            credentialsValue: { [Op.startsWith]: qs },
          },
        });
      }
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
