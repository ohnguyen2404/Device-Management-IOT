const CustomerDAO = require('../dao/customer')
const AuthApi = require('../external-api/auth')

const CustomerService = {
  async getAll(tenantId) {
    return await CustomerDAO.getAll(tenantId)
  },

  async get(customerId) {
    return await CustomerDAO.get(customerId)
  },

  async create(userId, options) {
    //const data = {
    //  "email": "ntan@gmail.com",
    //  "firstName": "An",
    //  "lastName": "Nguyen",
    //  "password": "123456"
    //}
    //const registerUser = await AuthApi.register(data)
    //if (!registerUser) {
    //  return false
    //}

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