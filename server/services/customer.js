const CustomerDAO = require('../dao/customer')
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
    const userId = await AuthApi.register({email, firstName, lastName, authorities}, token)

    if (!userId) {
      return false
    }
    return await CustomerDAO.create(userId, createUid, restOptions)
  },

  async update(customerId, options) {
    return await CustomerDAO.update(customerId, options)
  },

  async delete(customerId) {
    return await CustomerDAO.delete(customerId)
  }
}

module.exports = CustomerService