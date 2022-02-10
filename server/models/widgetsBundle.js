const { v4: uuidv4 } = require("uuid");
const constant = require("../helpers/constant");

const defaultWidgetBundles = [
  {
    title: "Charts",
    alias: constant.DEFAULT_WIDGETS_BUNDLE.CHARTS,
    description:
      "Display timeseries data using customizable line and bar charts. Use various pie charts to display latest values.",
  },
  {
    title: "Analogue gauges",
    alias: constant.DEFAULT_WIDGETS_BUNDLE.ANALOGUE_GAUGES,
    description:
      "Display temperature, humidity, speed, and other latest values on various analog gauge widgets.",
  },
];

module.exports = (sequelize, Sequelize) => {
  const WidgetsBundle = sequelize.define(
    "widgets_bundle",
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
      title: {
        type: Sequelize.STRING,
      },
      alias: {
        type: Sequelize.STRING,
        unique: true,
      },
      image: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
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

  WidgetsBundle.beforeCreate((bundle) => (bundle.id = uuidv4()));

  WidgetsBundle.initial = () => {
    defaultWidgetBundles.forEach(async (bundle) => {
      await WidgetsBundle.findOrCreate({
        where: {
          ...bundle
        },
        logging: false
      });
    });
  };

  return WidgetsBundle;
};
