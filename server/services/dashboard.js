const DashboardDAO = require("../dao/dashboard");

const DashboardService = {
  async getAllByTenantId(tenantId) {
    const rawDashboards = await DashboardDAO.getAllByTenantId(tenantId);

    const dashboards = rawDashboards.map((dashboard) => {
      const obj_configuration = JSON.parse(dashboard.configuration);
      return {
        ...dashboard,
        configuration: obj_configuration,
      };
    });

    return dashboards;
  },

  async getById(dashboardId) {
    return await DashboardDAO.getById(dashboardId);
  },

  async create(reqUser, options) {
    const { configuration, ...restOptions } = options;

    const str_configuration = JSON.stringify(configuration);

    const createDashboard = await DashboardDAO.create(reqUser, {
      configuration: str_configuration,
      ...restOptions,
    });

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

  async updateConfiguration(dashboardId, options) {
    const updatedDashboard = await DashboardDAO.getById(dashboardId);

    if (!updatedDashboard) {
      return false;
    }

    await DashboardDAO.updateConfiguration(dashboardId, options.configuration);

    return await this.getById(dashboardId);
  },

  async delete(dashboardId) {
    return await DashboardDAO.delete(dashboardId);
  },

  async assignCustomers(customers, dashboardId) {
    return await DashboardDAO.assignCustomers(customers, dashboardId);
  },
};

module.exports = DashboardService;
