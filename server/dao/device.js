const { Op } = require('sequelize')
const {Device} = require('../models')

const DeviceDAO = {
  async getAll(tenantId, customerId) {
    const deviceQuery = {
      where: {
        [Op.and]: [
          {deleted: false},
          customerId
          ? {tenantId,customerId}
          : {tenantId}
        ]
      } 

    }
    console.log('deviceQuery', deviceQuery);
    const devices = await Device.findAll(deviceQuery)

    return devices
  },

  async get(deviceId) {
    try {
      return await Device.findByPk(deviceId)
    }
    catch (e) {
      console.log('error', e.message);
      return false
    }
  },

  async create(tenantId, options) {

    console.log('options', options);

    try {
      await Device.create({
        ...options,
        tenantId
      })

      return true
    }
    catch(e) {
      console.log('error', e.message);
      return false
    }
  },

  async update(deviceId, options) {
    console.log('options', options);
    try {
      await Device.update(
        {...options},
        {where: {id: deviceId}}
      )
      return true
    }
    catch (e) {
      console.log('error', e.message);
      return false
    }
  },

  async delete(deviceId) {
    try {
      await Device.update(
        {deleted: true},
        {where: {id: deviceId}}
      )
      return true
    }
    catch (e) {
      console.log('error', e.message);
      return false
    }
  }
}

module.exports = DeviceDAO