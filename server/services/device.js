const DeviceDAO = require("../dao/device");
const DeviceCredentialsService = require("../services/deviceCredentials");

const DeviceService = {
  async getAll(tenantId, customerId) {
    return await DeviceDAO.getAll(tenantId, customerId);
  },

  async getById(deviceId) {
    return await DeviceDAO.getById(deviceId);
  },

  async create(reqUser, options) {
    const { credentialsType, credentialsValue, ...deviceOptions } = options;

    const createDevice = await DeviceDAO.create(
      reqUser,
      deviceOptions
    );

    const deviceCredentialsInfo = {
      deviceId: createDevice.id,
      credentialsType,
      credentialsValue,
      createUid: reqUser.userId,
    };

    await DeviceCredentialsService.create(deviceCredentialsInfo);
    
    return await this.getById(createDevice.id);
  },

  async update(deviceId, userId, options) {
    const deviceInfo = {
      ...options,
      updateUid: userId,
    };
    await DeviceDAO.update(deviceId, deviceInfo);

    return await this.getById(deviceId);
  },

  async delete(deviceId) {
    return await DeviceDAO.delete(deviceId);
  },
};

module.exports = DeviceService;
