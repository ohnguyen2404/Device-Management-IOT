const { Tenant } = require("../models");

const TenantDAO = {
  async getAll() {
    return await Tenant.findAll({
      where: { deleted: false },
    });
  },

  async getAllByTenantId(tenantId) {
    return await Tenant.findAll({
      where: {
        tenantId,
        deleted: false,
      },
    });
  },

  async existsByEmail(email) {
    const query = {
      where: {
        email,
      },
    };
    return (await Tenant.findOne(query)) !== null;
  },

  async get(tenantId) {
    try {
      return await Tenant.findByPk(tenantId);
    } catch (e) {
      console.log("error", e.message);
      return false;
    }
  },

  async getByUserId(userId) {
    try {
      return await Tenant.findOne({
        where: { userId },
      });
    } catch (e) {
      console.log("error", e.message);
      return false;
    }
  },

  async createWithCreateUid(userId, createUid, options) {
    console.log("options", options);
    console.log("userId", userId);
    console.log("createUid", createUid);
    try {
      await Tenant.create({
        ...options,
        userId,
        createUid,
      });

      return true;
    } catch (e) {
      console.log("error", e.message);
      return false;
    }
  },

  async create(userId, options) {
    try {
      await Tenant.create({
        ...options,
        userId,
      });

      return true;
    } catch (e) {
      console.log("error", e.message);
      return false;
    }
  },

  async update(tenantId, options) {
    console.log("options", options);
    try {
      await Tenant.update({ ...options }, { where: { id: tenantId } });
      return true;
    } catch (e) {
      console.log("error", e.message);
      return false;
    }
  },

  async delete(tenantId) {
    try {
      await Tenant.update({ deleted: true }, { where: { id: tenantId } });
      return true;
    } catch (e) {
      console.log("error", e.message);
      return false;
    }
  },

  async register(userId, email) {
    try {
      await Tenant.create({
        userId,
        email,
      });
      return true;
    } catch (e) {
      console.log("error", e.message);
      return false;
    }
  },
};

module.exports = TenantDAO;
