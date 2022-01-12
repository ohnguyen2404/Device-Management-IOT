const DashboardDAO = require("../dao/dashboard");

const DashboardService = {
  async getAllByTenantId(tenantId) {
    return await DashboardDAO.getAllByTenantId(tenantId);
  },

  async getById(dashboardId) {
    return await DashboardDAO.getById(dashboardId);
  },

  async create(reqUser, options) {
    const createDashboard = await DashboardDAO.create(reqUser, options);

    return await this.getById(createDashboard.id);
  },

  async update(dashboardId, options) {
    const updatedDashboard = await DashboardDAO.getById(dashboardId);

    if (!updatedDashboard) {
      return false;
    }

    await DashboardDAO.update(dashboardId, options);

    return await this.getById(dashboardId);
  },

  async delete(dashboardId) {
    return await DashboardDAO.delete(dashboardId)
  },

  async assignCustomers(customers, dashboardId) {
    return await DashboardDAO.assignCustomers(customers, dashboardId)
  }
};

module.exports = DashboardService;
