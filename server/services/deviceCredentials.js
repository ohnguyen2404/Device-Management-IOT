const DeviceCredentialsDAO = require("../dao/deviceCredentials");
const constant = require("../helpers/constant");
const crypto = require('crypto')

const DeviceCredentialsService = {
  async get(deviceId) {
    return await DeviceDAO.get(deviceId);
  },

  async create(options) {
    const { deviceId, credentialsType, credentialsValue, createUid } = options;
    let rawCredentialsValue = {};
    let credentialsId;
    if (credentialsType === constant.DEVICE_CREDENTIALS_TYPE_ACCESS_TOKEN) {
      rawCredentialsValue = {
        accessToken: credentialsValue,
      };
      credentialsId = credentialsValue
    }

    if (credentialsType === constant.DEVICE_CREDENTIALS_TYPE_X_509) {
      rawCredentialsValue = {
        RSAPublicKey: credentialsValue,
      };
      credentialsId = crypto.randomBytes(10).toString('hex') // generate 20 random chars
    }

    if (credentialsType === constant.DEVICE_CREDENTIALS_TYPE_MQTT_BASIC) {
      rawCredentialsValue = {
        clientId: credentialsValue.clientId,
        username: credentialsValue.username,
        password: credentialsValue.password,
      };
      credentialsId = crypto.randomBytes(10).toString('hex') // generate 20 random chars
    }
    console.log("rawCredentialsValue", credentialsId);

    return await DeviceCredentialsDAO.create({
      deviceId,
      credentialsType,
      credentialsId,
      credentialsValue: JSON.stringify(rawCredentialsValue),
      createUid
    });
  },

  async update(deviceId, options) {
    return await DeviceCredentialsDAO.update(deviceId, options);
  },

};

module.exports = DeviceCredentialsService;
