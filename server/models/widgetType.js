const { v4: uuidv4 } = require("uuid");
const constant = require("../helpers/constant");

const defaultWidgetTypes = [
  // CHARTS
  {
    name: "Bar Chart",
    alias: constant.DEFAULT_WIDGET_TYPE.BAR_CHART,
    bundleAlias: constant.DEFAULT_WIDGETS_BUNDLE.CHARTS,
    description:
      "Displays changes to timeseries data over time. For example, daily water consumption for last month.",
    descriptor: '{"sizeX":4,"sizeY":3}',
  },
  {
    name: "Line Chart",
    alias: constant.DEFAULT_WIDGET_TYPE.LINE_CHART,
    bundleAlias: constant.DEFAULT_WIDGETS_BUNDLE.CHARTS,
    description:
      "Displays changes to timeseries data over time. For example, temperature or humidity readings.",
    descriptor: '{"sizeX":4,"sizeY":3}',
  },
  {
    name: "Pie Chart",
    alias: constant.DEFAULT_WIDGET_TYPE.PIE_CHART,
    bundleAlias: constant.DEFAULT_WIDGETS_BUNDLE.CHARTS,
    description:
      "Displays latest values of the attributes or timeseries data for multiple entities in a pie chart. Supports numeric values only.",
    descriptor: '{"sizeX":2,"sizeY":2}',
  },

  // ANALOGUE GAUGES
  {
    name: "Linear Gauge",
    alias: constant.DEFAULT_WIDGET_TYPE.LINEAR_GAUGE,
    bundleAlias: constant.DEFAULT_WIDGETS_BUNDLE.ANALOGUE_GAUGES,
    description:
      "Preconfigured widget to display temperature. Allows to configure temperature range, gradient colors and other settings.",
    descriptor: '{"sizeX":6,"sizeY":2}',
  },
  {
    name: "Radial Gauge",
    alias: constant.DEFAULT_WIDGET_TYPE.RADIAL_GAUGE,
    bundleAlias: constant.DEFAULT_WIDGETS_BUNDLE.ANALOGUE_GAUGES,
    description:
      "Preconfigured gauge to display any value reading. Allows to configure value range, gradient colors and other settings.",
    descriptor: '{"sizeX":3,"sizeY":3}',
  },
];

module.exports = (sequelize, Sequelize) => {
  const WidgetType = sequelize.define(
    "widget_type",
    {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
      },
      tenantId: {
        type: Sequelize.UUID,
        references: {
          model: "tenant",
          key: "id",
        },
      },
      name: {
        type: Sequelize.STRING,
      },
      alias: {
        type: Sequelize.STRING,
        unique: true,
      },
      bundleAlias: {
        type: Sequelize.STRING,
      },
      image: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
      descriptor: {
        type: Sequelize.STRING(1000000),
      },
      deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      createUid: {
        type: Sequelize.UUID,
      },
      updateUid: {
        type: Sequelize.UUID,
      },
    },
    {
      underscored: true,
      freezeTableName: true,
      defaultScope: {
        attributes: {
          exclude: [
            "deleted",
            "createUid",
            "updateUid",
            "createdAt",
            "updatedAt",
          ],
        },
      },
    }
  );

  WidgetType.beforeCreate((widget) => (widget.id = uuidv4()));

  WidgetType.initial = () => {
    defaultWidgetTypes.forEach(async (widget) => {
      await WidgetType.findOrCreate({
        where: {
          ...widget,
        },
        logging: false,
      });
    });
  };

  return WidgetType;
};
