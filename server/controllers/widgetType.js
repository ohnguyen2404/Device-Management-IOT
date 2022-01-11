const WidgetTypeService = require("../services/widgetType");
const EntityService = require("../services/entity");
const { StatusCodes, getReasonPhrase } = require("http-status-codes");
const { log } = require("../helpers/logger");

const generateAlias = (title) => {
  const alias = title.trim().toLowerCase().replace(" ", "_")
  return alias
}

module.exports = {
  async getWidgetTypes(req, res) {
    const { authorities, userId } = req;
    const userEntity = await EntityService.getUserEntity(userId, authorities);
    if (!userEntity) {
      res.status(StatusCodes.BAD_REQUEST).send({
        message: "Can't find entity information with provided token.",
      });
      return;
    }

    const { tenantId } = userEntity;

    const result = await WidgetTypeService.getAllByTenantId(tenantId);

    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: "Can not get widget types!",
        status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res.status(StatusCodes.OK).send(result);
  },

  async getWidgetType(req, res) {
    const widgetId = req.params.widgetId;
    const result = await WidgetTypeService.getById(widgetId);

    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: `Can not get widget type with UUID: ${widgetId}!`,
        status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res.status(StatusCodes.OK).send(result);
  },

  async createWidgetType(req, res) {
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
        message: "Widget Type's title can not be empty",
      });
    }

    const alias = generateAlias(title)
    if (await EntityService.isExistedWidgetTypeAlias(alias)) {
      res.status(StatusCodes.BAD_REQUEST).send({
        message: "Widget Type's alias has already existed.",
      });
      return;
    }

    const { tenantId } = userEntity;
    const result = await WidgetTypeService.create(
      { tenantId, userId },
      {alias, ...options}
    );

    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: "Can not create widget type!",
        status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res.status(StatusCodes.OK).send(result);
  },

  async updateWidgetType(req, res) {
    const widgetId = req.params.widgetId;
    const options = req.body;
    const {userId, authorities} = req

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
        message: "Widget Type's title can not be empty",
      });
    }

    const alias = generateAlias(title)
    if (await EntityService.isExistedWidgetTypeAlias(alias, widgetId)) {
      res.status(StatusCodes.BAD_REQUEST).send({
        message: "Widget Type's alias has already existed.",
      });
      return;
    }

    const result = await WidgetTypeService.update(
      widgetId,
      {alias, ...options},
    );
    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: "Can not update widget type!",
        status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res.status(StatusCodes.OK).send(result);
  },

  async deleteWidgetType(req, res) {
    const widgetId = req.params.widgetId;

    const result = await WidgetTypeService.delete(widgetId);
    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: "Can not delete widget type!",
        status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res.status(StatusCodes.OK).send({
      message: "Delete widget type successful!",
    });
  },
};
