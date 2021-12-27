const DeviceCredentialsDAO = require("../dao/deviceCredentials");
const constant = require("../helpers/constant");
const crypto = require("crypto");

const DeviceCredentialsService = {
  async validateToken(deviceToken) {
    return await DeviceCredentialsDAO.getByCredentialsId(deviceToken);
  },

  async create(options) {
    const { deviceId, credentialsType, credentialsValue, createUid } = options;
    let rawCredentialsValue = {};
    let credentialsId;
    if (credentialsType === constant.DEVICE_CREDENTIALS_TYPE_ACCESS_TOKEN) {
      if (!credentialsValue) {
        const randomAccessToken = crypto.randomBytes(10).toString("hex"); // generate 20 random chars
        rawCredentialsValue = {
          accessToken: randomAccessToken,
        };
        credentialsId = randomAccessToken;
      } else {
        rawCredentialsValue = {
          accessToken: credentialsValue.accessToken,
        };
        credentialsId = credentialsValue.accessToken;
      }
    }

    if (credentialsType === constant.DEVICE_CREDENTIALS_TYPE_X_509) {
      rawCredentialsValue = {
        RSAPublicKey: credentialsValue.RSAPublicKey,
      };
      credentialsId = crypto.randomBytes(10).toString("hex"); // generate 20 random chars
    }

    if (credentialsType === constant.DEVICE_CREDENTIALS_TYPE_MQTT_BASIC) {
      rawCredentialsValue = {
        clientId: credentialsValue.clientId,
        username: credentialsValue.username,
        password: credentialsValue.password,
      };
      credentialsId = crypto.randomBytes(10).toString("hex"); // generate 20 random chars
    }
    console.log("rawCredentialsValue", credentialsId);

    return await DeviceCredentialsDAO.create({
      deviceId,
      credentialsType,
      credentialsId,
      credentialsValue: JSON.stringify(rawCredentialsValue),
      createUid,
    });
  },

  async update(deviceId, options) {
    return await DeviceCredentialsDAO.update(deviceId, options);
  },
};

module.exports = DeviceCredentialsService;
