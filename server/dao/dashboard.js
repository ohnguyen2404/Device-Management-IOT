const { Dashboard, DashboardCustomer } = require("../models");
const { Op } = require("sequelize");
const logger = require("../helpers/logger");

const DashboardDAO = {
  async getAll() {
    return await Dashboard.findAll({
      where: { deleted: false },
    });
  },

  async getAllByTenantId(tenantId) {
    return await Dashboard.findAll({
      where: {
        tenantId,
        deleted: false,
      },
      raw: true
    });
  },

  async getById(dashboardId) {
    try {
      return await Dashboard.findByPk(dashboardId, { raw: true });
    } catch (e) {
      logger.error(e.message);
      return false;
    }
  },

  async getByTitleExcludeOwnId(title, dashboardId = null) {
    try {
      return await Dashboard.findOne({
        where: {
          title,
          id: { [Op.ne]: dashboardId },
        },
      });
    } catch (e) {
      logger.error(e.message);
      return false;
    }
  },

  async create(reqUser, options) {
    try {
      return await Dashboard.create({
        ...options,
        tenantId: reqUser.tenantId,
        createUid: reqUser.userId,
      });
    } catch (e) {
      logger.error(e.message);
      return false;
    }
  },

  async update(dashboardId, options) {
    try {
      await Dashboard.update({ ...options }, { where: { id: dashboardId } });

      return true;
    } catch (e) {
      logger.error(e.message);
      return false;
    }
  },

  async updateConfiguration(dashboardId, widgets) {
    try {
      await Dashboard.update({ configuration: widgets }, { where: { id: dashboardId } });

      return true;
    } catch (e) {
      logger.error(e.message);
      return false;
    }
  },

  async delete(dashboardId) {
    try {
      await Dashboard.update({ deleted: true }, { where: { id: dashboardId } });

      return true;
    } catch (e) {
      logger.error(e.message);
      return false;
    }
  },

  async assignCustomers(customers, dashboardId) {
    try {
      await Dashboard.update(
        { assignedCustomers: customers },
        { where: { id: dashboardId } }
      );
      return true;
    } catch (e) {
      logger.error(e.message);
      return false;
    }
  },
};

module.exports = DashboardDAO;
