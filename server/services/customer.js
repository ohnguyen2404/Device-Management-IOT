const CustomerDAO = require('../dao/customer')
const TenantDAO = require('../dao/tenant')
const AuthApi = require('../external-api/auth')

const CustomerService = {
  async getAll(tenantId) {
    return await CustomerDAO.getAll(tenantId)
  },

  async get(customerId) {
    return await CustomerDAO.get(customerId)
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

    return await CustomerDAO.createWithCreateUid(userId, createUid, restOptions)
  },

  async update(customerId, options) {
    return await CustomerDAO.update(customerId, options)
  },

  async delete(customerId) {
    return await CustomerDAO.delete(customerId)
  }
}

module.exports = CustomerService