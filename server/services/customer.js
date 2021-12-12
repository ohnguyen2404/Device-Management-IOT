const CustomerDAO = require('../dao/customer')

const CustomerService = {
  async getAll(tenantId) {
    return await CustomerDAO.getAll(tenantId)
  },

  async get(customerId) {
    return await CustomerDAO.get(customerId)
  },

  async create(userId, options) {
    return await CustomerDAO.create(userId, options)
  },

  async update(customerId, options) {
    return await CustomerDAO.update(customerId, options)
  },

  async delete(customerId) {
    return await CustomerDAO.delete(customerId)
  }
}

module.exports = CustomerService