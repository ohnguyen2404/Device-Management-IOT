const DeviceCredentialsDAO = require("../dao/deviceCredentials");
const DeviceDAO = require("../dao/device");
const constant = require("../helpers/constant");
const crypto = require("crypto");

const DeviceCredentialsService = {
  async validateToken(token, type) {
    let credentials = null;
    switch (type) {
      case constant.DEVICE_CREDENTIALS_TYPE_ACCESS_TOKEN:
        credentials = await DeviceCredentialsDAO.getByCredentialsId(token);
        break;

      case constant.DEVICE_CREDENTIALS_TYPE_X_509:
        const x509Token = token
          .replace("-----BEGIN PUBLIC KEY-----", "")
          .replace("-----END PUBLIC KEY-----", "")
          .replace(/\n/g, "")
          .trim();

        const x509HashToken = crypto
          .createHash("sha256")
          .update(x509Token)
          .digest("hex");
        credentials = await DeviceCredentialsDAO.getByCredentialsId(
          x509HashToken
        );
        break;

      case constant.DEVICE_CREDENTIALS_TYPE_MQTT_BASIC:
        const mqttBasicToken = JSON.stringify(token);
        const mqttBasicHashToken = crypto
          .createHash("sha256")
          .update(mqttBasicToken)
          .digest("hex");

        credentials = await DeviceCredentialsDAO.getByCredentialsId(
          mqttBasicHashToken
        );
        break;

      default:
        break;
    }
    
    if (!credentials) return false;
    return await DeviceDAO.get(credentials.deviceId);
  },

  async create(options) {
    const { deviceId, credentialsType, credentialsValue, createUid } = options;
    let rawCredentialsValue;
    let credentialsId;
    if (credentialsType === constant.DEVICE_CREDENTIALS_TYPE_ACCESS_TOKEN) {
      // Default case: user don't provide any credentials
      // Note: credentials type ACCESS_TOKEN will have it's credentials_value = null
      if (!credentialsValue || !credentialsValue.accessToken) {
        const randomAccessToken = crypto.randomBytes(10).toString("hex"); // generate 20 random chars
        credentialsId = randomAccessToken;
      } else {
        credentialsId = credentialsValue.accessToken;
      }
      rawCredentialsValue = null;
    }

    // Note: credentials type X.509 will have it's credentials_id = (SHA256) hash of it's RSA PublicKey
    if (credentialsType === constant.DEVICE_CREDENTIALS_TYPE_X_509) {
      const processedRSAPublicKey = credentialsValue.RSAPublicKey.replace(
        "-----BEGIN PUBLIC KEY-----",
        ""
      )
        .replace("-----END PUBLIC KEY-----", "")
        .replace(/\n/g, "")
        .trim();

      rawCredentialsValue = processedRSAPublicKey;
      credentialsId = crypto
        .createHash("sha256")
        .update(rawCredentialsValue)
        .digest("hex");
    }

    // Note: credentials type MQTT_BASIC will have it's credentials_id
    // = (SHA256) hash of it's stringified object's value (clientId, username, password)
    if (credentialsType === constant.DEVICE_CREDENTIALS_TYPE_MQTT_BASIC) {
      const mqttBasicInfo = {
        clientId: credentialsValue.clientId,
        username: credentialsValue.username,
        password: credentialsValue.password,
      };

      rawCredentialsValue = JSON.stringify(mqttBasicInfo);
      credentialsId = crypto
        .createHash("sha256")
        .update(rawCredentialsValue)
        .digest("hex");
    }

    return await DeviceCredentialsDAO.create({
      deviceId,
      credentialsType,
      credentialsId,
      credentialsValue: rawCredentialsValue,
      createUid,
    });
  },

  async update(deviceId, options) {
    return await DeviceCredentialsDAO.update(deviceId, options);
  },
};

module.exports = DeviceCredentialsService;
