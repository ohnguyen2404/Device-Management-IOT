const TenantDAO = require('../dao/tenant')
const CustomerDAO = require("../dao/customer")
const AuthApi = require('../external-api/auth')

const TenantService = {
  async getAll() {
    return await TenantDAO.getAll
  },

  async get(tenantId) {
    return await TenantDAO.get(tenantId)
  },

  async create(createUid, options, token) {
    const {email, firstName, lastName, authorities, ...restOptions} = options

    if (TenantDAO.existsByEmail(email) || CustomerDAO.existsByEmail(email)) {
      return false
    }

    const userId = await AuthApi.register({email, firstName, lastName, authorities}, token)
    
    if (!userId) {
      return false
    }
    return await TenantDAO.create(userId, createUid, restOptions)
  },

  async update(tenantId, options) {
    return await TenantDAO.update(tenantId, options)
  },

  async delete(tenantId) {
    return await TenantDAO.delete(tenantId)
  }
}

module.exports = TenantService