const {Customer} = require('../models')
const { Op } = require("sequelize");

const CustomerDAO = {
  async getAll(tenantId) {
    const customerQuery = {
      where: {
        [Op.and]: [
          {tenantId},
          {deleted: false}
        ]
      }
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

  async create(userId, options) {

    console.log('options', options);

    try {
      await Customer.create({
        ...options,
        userId
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

module.exports = CustomerDAO