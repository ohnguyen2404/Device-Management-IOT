const {Device} = require('../models')

const DeviceService = {
  async getAll(tenant_id, customer_id) {
    const deviceQuery = {
      where: customer_id
        ? {tenant_id,customer_id}
        : {tenant_id}
    }
    console.log('deviceQuery', deviceQuery);
    const devices = await Device.findAll({deviceQuery})

    return devices
  },

  async create(tenant_id, options) {

    console.log('options', options);

    try {
      await Device.create({
        ...options
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

module.exports = DeviceService