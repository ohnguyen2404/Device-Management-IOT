const TenantDAO = require("../dao/tenant");
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

    // tenantId of the reqUser
    let tenantId = null;
    const reqUserId = reqUser.userId;
    if (reqUser.authorities.includes("TENANT")) {
      const reqTenant = await TenantDAO.getByUserId(reqUserId);
      tenantId = reqTenant.id;
    }

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

  async update(deviceId, options) {
    return await DeviceDAO.update(deviceId, options);
  },

  async delete(deviceId) {
    return await DeviceDAO.delete(deviceId);
  },
};

module.exports = DeviceService;
