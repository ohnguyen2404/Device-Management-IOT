const TenantDAO = require('../dao/tenant')

const TenantService = {
  async getAll() {
    return await TenantDAO.getAll
  },

  async get(tenantId) {
    return await TenantDAO.get(tenantId)
  },

  async create(userId, options) {
    return await TenantDAO.create(userId, options)
  },

  async update(tenantId, options) {
    return await TenantDAO.update(tenantId, options)
  },

  async delete(tenantId) {
    return await TenantDAO.delete(tenantId)
  }
}

module.exports = TenantService