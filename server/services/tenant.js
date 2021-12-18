const TenantDAO = require('../dao/tenant')
const CustomerDAO = require("../dao/customer")
const AuthApi = require('../external-api/auth')

const TenantService = {
  async getAll() {
    return await TenantDAO.getAll()
  },

  async get(tenantId) {
    return await TenantDAO.get(tenantId)
  },

  async create(createUid, options, token) {
    const {email, firstName, lastName, authorities, ...restOptions} = options

    if (await TenantDAO.existsByEmail(email) || await CustomerDAO.existsByEmail(email)) {
      return false
    }

    const userId = await AuthApi.createUser({email, firstName, lastName, authorities}, token)
    if (!userId) {
      return false
    }
    return await TenantDAO.createWithCreateUid(userId, createUid, {email, firstName, lastName, ...restOptions})
  },

  async register(userId, options) {
    const {email} = options

    if (await TenantDAO.existsByEmail(email)) {
      return false
    }
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