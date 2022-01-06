const CustomerService = require("../services/customer");
const TenantService = require("../services/tenant");
const constant = require("../helpers/constant");

const EntityService = {
  async getUserEntity (userId, authorities) {
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
  }
}

module.exports = EntityService;
