const CustomerService = require("../services/customer");
const TenantService = require("../services/tenant");
const TenantDAO = require("../dao/tenant");
const CustomerDAO = require("../dao/customer");

const constant = require("../helpers/constant");

const EntityService = {
  async getUserEntity(userId, authorities) {
    let customerId, tenantId;
    if (authorities.includes(constant.ROLE_CUSTOMER)) {
      const customerUser = await CustomerService.getByUserId(userId)["id"];
      if (!customerUser) return false;

      customerId = customerUser.id;
    }

    if (authorities.includes(constant.ROLE_TENANT)) {
      const tenantUser = await TenantService.getByUserId(userId);
      if (!tenantUser) return false;

      tenantId = tenantUser.id;
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
};

module.exports = EntityService;
