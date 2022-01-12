const dashboardController = require("../controllers").dashboard;
const { authJwt } = require("../middleware");
const constants = require("../helpers/constant");

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow_Headers",
      `${constants.TOKEN_HEADER}, Origin, Content-Type, Accept`
    );
    next();
  });

  app.get(
    "/dashboards",
    [authJwt.verifyToken, authJwt.isTenantOrAdmin],
    dashboardController.getDashboards
  );
  app.get(
    "/dashboards/:dashboardId",
    [authJwt.verifyToken],
    dashboardController.getDashboard
  );
  app.post(
    "/dashboard",
    [authJwt.verifyToken, authJwt.isTenantOrAdmin],
    dashboardController.createDashboard
  );
  app.put(
    "/dashboards/:dashboardId",
    [
      authJwt.verifyToken,
      authJwt.isTenantOrAdmin
    ],
    dashboardController.updateDashboard)
  app.delete(
    "/dashboards/:dashboardId",
    [
      authJwt.verifyToken,
      authJwt.isTenantOrAdmin
    ],
    dashboardController.deleteDashboard)
  
  app.post(
    "/dashboards/:dashboardId/customer",
    [
      authJwt.verifyToken,
      authJwt.isTenantOrAdmin
    ],
    dashboardController.assignDashboardCustomer
  )
};
