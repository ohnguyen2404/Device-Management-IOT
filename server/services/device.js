const DeviceDAO = require('../dao/device')

const EntityService = {
  async getAll(tenantId, customerId) {
    return await DeviceDAO.getAll(tenantId, customerId)
  },

  async get(deviceId) {
    return await DeviceDAO.get(deviceId)
  },

  async create(tenantId, options) {
    return await DeviceDAO.create(tenantId, options)
  },

  async update(deviceId, options) {
    return await DeviceDAO.update(deviceId, options)
  },

  async delete(deviceId) {
    return await DeviceDAO.delete(deviceId)
  }
}

module.exports = EntityService