const CustomerService = require("../services/customer");
const TenantService = require("../services/tenant");
const TenantDAO = require("../dao/tenant");
const CustomerDAO = require("../dao/customer");
const WidgetsBundleDAO = require("../dao/widgetsBundle");
const WidgetTypeDAO = require("../dao/widgetType");

const constant = require("../helpers/constant");
const logger = require("../helpers/logger");

const EntityService = {
  async getUserEntity(userId, authorities) {
    let customerId, tenantId;
    if (authorities.includes(constant.ROLE_CUSTOMER)) {
      const customerUser = await CustomerService.getByUserId(userId)["id"];

      if (!customerUser) return false;

      if (customerUser.tenantId) {
        tenantId = customerUser.tenantId;
      }

      if (customerUser.customerId) {
        customerId = customerUser.customerId;
      } else {
        customerId = customerUser.id;
      }
    }

    if (authorities.includes(constant.ROLE_TENANT)) {
      const tenantUser = await TenantService.getByUserId(userId);

      if (!tenantUser) return false;

      if (tenantUser.tenantId) {
        tenantId = tenantUser.tenantId;
      } else {
        tenantId = tenantUser.id;
      }
    }

    return { customerId, tenantId };
  },

  async isExistedEmail(email) {
    if (
      (await TenantDAO.existsByEmail(email)) ||
      (await CustomerDAO.existsByEmail(email))
    ) {
      return true;
    }

    return false;
  },

  async isExistedWidgetsBundleAlias(alias, bundleId = null) {
    if (await WidgetsBundleDAO.getByAliasExcludeOwnId(alias, bundleId)) {
      return true;
    }

    return false;
  },

  async isExistedWidgetTypeAlias(alias, widgetId = null) {
    if (await WidgetTypeDAO.getByAliasExcludeOwnId(alias, widgetId)) {
      return true;
    }

    return false;
  }
};

module.exports = EntityService;
