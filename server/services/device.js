const DeviceDAO = require("../dao/device");
const DeviceCredentialsService = require("../services/deviceCredentials");

const DeviceService = {
  async getAll(tenantId, customerId) {
    return await DeviceDAO.getAll(tenantId, customerId);
  },

  async getById(deviceId) {
    return await DeviceDAO.get(deviceId);
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
