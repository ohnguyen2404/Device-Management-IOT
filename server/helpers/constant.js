require("dotenv").config();

module.exports = {
  // Database
  DATABASE_USERNAME: process.env.DB_USERNAME,
  DATABASE_PASSWORD: process.env.DB_PASSWORD,
  DATABASE_NAME: process.env.DB_NAME,
  DATABASE_HOST: process.env.DB_HOST,
  DATABASE_PORT: process.env.DB_PORT,
  DATABASE_DIALECT: process.env.DB_DIALECT,

  // Token header
  TOKEN_HEADER: "Authorization",
  TOKEN_START: "Bearer ",

  // API URL
  IOT_CORE_URL: process.env.IOT_CORE_URL,

  // ROLES
  AUTHORITIES: ["ADMIN", "TENANT", "CUSTOMER"],

  ROLE_ADMIN: "ADMIN",
  ROLE_TENANT: "TENANT",
  ROLE_CUSTOMER: "CUSTOMER",

  // DEVICE_CREDENTIALS
  DEVICE_CREDENTIALS_TYPE_ACCESS_TOKEN: "ACCESS_TOKEN",
  DEVICE_CREDENTIALS_TYPE_X_509: "X509_CERTIFICATE",
  DEVICE_CREDENTIALS_TYPE_MQTT_BASIC: "MQTT_BASIC",

  // WIDGETS BUNDLE
  DEFAULT_WIDGETS_BUNDLE: {
    CHARTS: "charts",
    ANALOGUE_GAUGES: "analogue_gauges",
  },

  // WIDGET TYPE
  DEFAULT_WIDGET_TYPE: {
    // CHARTS
    BAR_CHART: "bar_chart",
    LINE_CHART: "line_chart",
    PIE_CHART: "pie_chart",

    // ANALOGUE_GAUGES
    RADIAL_GAUGE: "radial_gauge",
    LINEAR_GAUGE: "linear_gauge",
  },
};
