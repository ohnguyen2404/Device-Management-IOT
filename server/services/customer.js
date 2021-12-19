const CustomerDAO = require("../dao/customer");
const TenantDAO = require("../dao/tenant");
const AuthApi = require("../external-api/auth");

const CustomerService = {
  async getAll(user) {
    const { authorities, userId } = user;
    if (authorities.includes("ADMIN")) return await CustomerDAO.getAll();

    if (authorities.includes("TENANT")) {
      const userTenant = await TenantDAO.getByUserId(userId);
      return await CustomerDAO.getAllByTenantId(userTenant.id);
    }

    if (authorities.includes("CUSTOMER")) {
      const userCustomer = await CustomerDAO.getByUserId(userId);
      return await CustomerDAO.getAllByCustomerId(userCustomer.id);
    }

    return false;
  },

  async get(customerId) {
    return await CustomerDAO.get(customerId);
  },

  async create(reqUser, options, token) {
    const { email, firstName, lastName, authorities, ...restOptions } = options;

    if (
      (await TenantDAO.existsByEmail(email)) ||
      (await CustomerDAO.existsByEmail(email))
    ) {
      return false;
    }

    // tenantId of the reqUser
    let tenantId = null;
    if (reqUser.authorities.includes("TENANT")) {
      const reqTenant = await TenantDAO.getByUserId(reqUser.userId);
      tenantId = reqTenant.id;
    }

    // customerId of the reqUser
    let customerId = null;
    if (reqUser.authorities.includes("CUSTOMER")) {
      const reqCustomer = await CustomerDAO.getByUserId(reqUser.userId);
      customerId = reqCustomer.id;
    }

    const userId = await AuthApi.createUser(
      { email, firstName, lastName, authorities },
      token
    );
    if (!userId) {
      return false;
    }

    return await CustomerDAO.createWithCreateUid(userId, reqUser.userId, {
      ...restOptions,
      email,
      tenantId,
      customerId,
    });
  },

  async update(customerId, options) {
    return await CustomerDAO.update(customerId, options);
  },

  async delete(customerId, token) {
    const customerUser = await CustomerDAO.get(customerId);
    if (customerUser.userId) {
      await AuthApi.deleteUser(customerUser.userId, token);
      return await CustomerDAO.delete(customerId);
    }
    return false;
  },
};

module.exports = CustomerService;
