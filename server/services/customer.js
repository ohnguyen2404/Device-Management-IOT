const {Customer} = require('../models')

const CustomerService = {
  async getAll(tenant_id) {
    const customerQuery = {
      where: {tenant_id}
    }
    console.log('customerQuery', customerQuery);
    const customers = await Customer.findAll({customerQuery})

    return customers
  },

  async get(customerId) {
    try {
      return await Customer.findByPk(customerId)
    }
    catch (e) {
      console.log('error', e.message);
      return false
    }
  },

  async create(user_id, options) {

    console.log('options', options);

    try {
      await Customer.create({
        ...options,
        user_id
      })

      return true
    }
    catch(e) {
      console.log('error', e.message);
      return false
    }
  },

  async update(customerId, options) {
    console.log('options', options);
    try {
      await Customer.update(
        {...options},
        {where: {id: customerId}}
      )
      return true
    }
    catch (e) {
      console.log('error', e.message);
      return false
    }
  },

  async delete(customerId) {
    try {
      await Customer.update(
        {deleted: true},
        {where: {id: customerId}}
      )
      return true
    }
    catch (e) {
      console.log('error', e.message);
      return false
    }
  }
}

module.exports = CustomerService