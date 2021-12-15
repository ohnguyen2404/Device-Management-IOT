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

  async create(userId, createUid, options) {
    console.log('options', options);
    try {
      await Tenant.create({
        ...options,
        userId,
        createUid
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
  },

  async register(userId, email) {
    try {
      await Tenant.create({
        userId,
        email
      })
      return true
    }
    catch(e) {
      console.log('error', e.message);
      return false
    }
  },
}

module.exports = TenantDAO