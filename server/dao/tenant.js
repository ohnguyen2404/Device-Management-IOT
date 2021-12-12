const {Tenant} = require('../models')

const TenantDAO = {
  async getAll() {
    const tenants = await Tenant.findAll({
      where: {deleted: false}
    })
    return tenants
  },

  async get(tenantId) {
    try {
      return await Tenant.findByPk(tenantId)
    }
    catch (e) {
      console.log('error', e.message);
      return false
    }
  },

  async create(userId, options) {
    console.log('options', options);

    try {
      await Tenant.create({
        ...options,
        userId,
        createUid: userId
      })

      return true
    }
    catch(e) {
      console.log('error', e.message);
      return false
    }
  },

  async update(tenantId, options) {
    console.log('options', options);
    try {
      await Tenant.update(
        {...options},
        {where: {id: tenantId}}
      )
      return true
    }
    catch (e) {
      console.log('error', e.message);
      return false
    }
  },

  async delete(tenantId) {
    try {
      await Tenant.update(
        {deleted: true},
        {where: {id: tenantId}}
      )
      return true
    }
    catch (e) {
      console.log('error', e.message);
      return false
    }
  }
}

module.exports = TenantDAO