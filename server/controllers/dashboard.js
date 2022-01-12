const DashboardService = require("../services/dashboard");
const EntityService = require("../services/entity");
const { StatusCodes, getReasonPhrase } = require("http-status-codes");

const generateAlias = (title) => {
  const alias = title.trim().toLowerCase().replace(" ", "_");
  return alias;
};

module.exports = {
  async getDashboards(req, res) {
    const { authorities, userId } = req;
    const userEntity = await EntityService.getUserEntity(userId, authorities);
    if (!userEntity) {
      res.status(StatusCodes.BAD_REQUEST).send({
        message: "Can't find entity information with provided token.",
      });
      return;
    }

    const { tenantId } = userEntity;

    const result = await DashboardService.getAllByTenantId(tenantId);

    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: "Can not get dashboards!",
        status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res.status(StatusCodes.OK).send(result);
  },

  async getDashboard(req, res) {
    const dashboardId = req.params.dashboardId;
    const result = await DashboardService.getById(dashboardId);

    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: `Can not get dashboards with UUID: ${dashboardId}!`,
        status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res.status(StatusCodes.OK).send(result);
  },

  async createDashboard(req, res) {
    const options = req.body;
    const { userId, authorities } = req;
    const userEntity = await EntityService.getUserEntity(userId, authorities);
    if (!userEntity) {
      res.status(StatusCodes.BAD_REQUEST).send({
        message: "Can't find entity information with provided token.",
      });
      return;
    }

    const { title } = options;
    if (!title) {
      res.status(StatusCodes.BAD_REQUEST).send({
        message: "Dashboard's title can not be empty",
      });
      return;
    }

    if (await EntityService.isExistedDashboardTitle(title)) {
      res.status(StatusCodes.BAD_REQUEST).send({
        message: "Dashboard title has already existed.",
      });
      return;
    }

    const { tenantId } = userEntity;
    const result = await DashboardService.create({ tenantId, userId }, options);

    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: "Can not create dashboards!",
        status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res.status(StatusCodes.OK).send(result);
  },

  async updateDashboard(req, res) {
    const dashboardId = req.params.dashboardId;
    const options = req.body;
    const { userId, authorities } = req;

    const userEntity = await EntityService.getUserEntity(userId, authorities);
    if (!userEntity) {
      res.status(StatusCodes.BAD_REQUEST).send({
        message: "Can't find entity information with provided token.",
      });
      return;
    }

    const { title } = options;
    if (!title) {
      res.status(StatusCodes.BAD_REQUEST).send({
        message: "Dashboard's title can not be empty",
      });
      return;
    }

    if (await EntityService.isExistedDashboardTitle(title, dashboardId)) {
      res.status(StatusCodes.BAD_REQUEST).send({
        message: "Dashboard title has already existed.",
      });
      return;
    }

    const result = await DashboardService.update(dashboardId, options);
    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: "Can not update dashboard!",
        status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res.status(StatusCodes.OK).send(result);
  },

  async deleteDashboard(req, res) {
    const dashboardId = req.params.dashboardId;

    const result = await DashboardService.delete(dashboardId);
    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: "Can not delete dashboard!",
        status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res.status(StatusCodes.OK).send({
      message: "Delete dashboards successful!",
    });
  },

  async assignDashboardCustomer(req, res) {
    const dashboardId = req.params.dashboardId
    const {customerIds} = req.body

    const result = await DashboardService.assignCustomers(customerIds, dashboardId)
    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: "Can not assign customers to dashboard!",
        status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res.status(StatusCodes.OK).send({
      message: "Assign customers to dashboard successful!",
    });
  }
};
