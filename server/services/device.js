const DeviceDAO = require("../dao/device");
const DeviceCredentialsService = require("../services/deviceCredentials");
const constant = require("../helpers/constant")

const DeviceService = {
  async getAll(tenantId, customerId) {
    return await DeviceDAO.getAll(tenantId, customerId);
  },

  async getById(deviceId) {
    const device = await DeviceDAO.get(deviceId)
    const deviceCredentials = await DeviceCredentialsService.getByDeviceId(deviceId)
    const response = {
      device,
      deviceCredentials
    }

    return response;
  },

  async create(reqUser, options) {
    const { credentialsType, credentialsValue, ...deviceOptions } = options;

    const tenantId = reqUser.tenantId;
    const reqUserId = reqUser.userId;

    const createDevice = await DeviceDAO.create(
      { reqUserId, tenantId },
      deviceOptions
    );

    const deviceCredentialsInfo = {
      deviceId: createDevice.id,
      credentialsType,
      credentialsValue,
      createUid: reqUserId,
    };

    return await DeviceCredentialsService.create(deviceCredentialsInfo);
  },

  async update(deviceId, userId, options) {
    const { credentialsType, credentialsValue, ...deviceOptions } = options;
    const deviceInfo = {
      ...deviceOptions,
      updateUid: userId
    }
    await DeviceDAO.update(deviceId, deviceInfo);
    return await DeviceCredentialsService.update(deviceId, {userId, credentialsType, credentialsValue})
  },

  async delete(deviceId) {
    return await DeviceDAO.delete(deviceId);
  },
};

module.exports = DeviceService;
