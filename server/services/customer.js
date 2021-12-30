const CustomerDAO = require("../dao/customer");
const TenantDAO = require("../dao/tenant");
const AuthApi = require("../external-api/auth");
const constant = require("../helpers/constant");

const CustomerService = {
  async getAll(user) {
    const { authorities, tenantId, customerId } = user;
    if (authorities.includes(constant.ROLE_ADMIN))
      return await CustomerDAO.getAll();

    let customerList = [];

    if (authorities.includes(constant.ROLE_TENANT)) {
      const customers = await CustomerDAO.getAllByTenantId(tenantId);
      customerList = [...customerList, ...customers];
    }

    if (authorities.includes(constant.ROLE_CUSTOMER)) {
      const customers = await CustomerDAO.getAllByCustomerId(customerId);
      customerList = [...customerList, ...customers];
    }
    return customerList;
  },

  async get(customerId, token) {
    const customer = await CustomerDAO.get(customerId);
    const user = await AuthApi.getUser(customer.userId, token);

    return {
      ...customer,
      ...user,
    };
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
    const tenantId = reqUser.tenantId;

    // customerId of the reqUser
    const customerId = reqUser.customerId;

    // call external-api to create new user and retreive userId
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

  async update(customerId, options, token) {
    const {
      email,
      firstName,
      lastName,
      deleted = false,
      ...restOptions
    } = options;
    const updatedCustomer = await CustomerDAO.get(customerId);

    if (!updatedCustomer) {
      return false;
    }

    await AuthApi.updateUser(
      updatedCustomer.userId,
      {
        email,
        firstName,
        lastName,
        deleted,
      },
      token
    );

    return await CustomerDAO.update(customerId, restOptions);
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
