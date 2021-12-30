const { Customer } = require("../models");

const CustomerDAO = {
  async getAll() {
    return await Customer.findAll({
      where: {deleted: false}
    });
  },

  async getAllByTenantId(tenantId) {
    return await Customer.findAll({
      where: {
        tenantId,
        deleted: false,
      },
    });
  },

  async getAllByCustomerId(customerId) {
    return await Customer.findAll({
      where: {
        customerId,
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
    return (await Customer.findOne(query)) !== null;
  },

  async get(customerId) {
    try {
      return await Customer.findByPk(customerId);
    } catch (e) {
      console.log("error", e.message);
      return false;
    }
  },

  async getByUserId(userId) {
    try {
      return await Customer.findOne({
        where: { userId },
        raw: true
      });
    } catch (e) {
      console.log("error", e.message);
      return false;
    }
  },

  async createWithCreateUid(userId, createUid, options) {
    try {
      await Customer.create({
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

  async update(customerId, options) {
    console.log("options", options);
    try {
      await Customer.update({ ...options }, { where: { id: customerId } });

      return true;
    } catch (e) {
      console.log("error", e.message);
      return false;
    }
  },

  async delete(customerId) {
    try {
      await Customer.update({ deleted: true }, { where: { id: customerId } });

      return true;
    } catch (e) {
      console.log("error", e.message);
      return false;
    }
  },
};

module.exports = CustomerDAO;
