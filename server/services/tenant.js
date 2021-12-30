const TenantDAO = require("../dao/tenant");
const CustomerDAO = require("../dao/customer");
const AuthApi = require("../external-api/auth");
const constant = require("../helpers/constant")

const TenantService = {
  async getAll(user) {
    const { authorities, tenantId } = user;
    if (authorities.includes(constant.ROLE_ADMIN)) return await TenantDAO.getAll();

    if (authorities.includes(constant.ROLE_TENANT)) {
      return await TenantDAO.getAllByTenantId(tenantId);
    }

    return false;
  },

  async get(tenantId, token) {
    const tenant = await TenantDAO.get(tenantId);
    const user = await AuthApi.getUser(tenant.userId, token)

    return {
      ...tenant,
      ...user
    }
  },

  async create(reqUser, options, token) {
    const { email, firstName, lastName, authorities, ...restOptions } = options;

    if (
      (await TenantDAO.existsByEmail(email)) ||
      (await CustomerDAO.existsByEmail(email))
    ) {
      return false;
    }


    // call external-api to create new user and retreive userId
    const userId = await AuthApi.createUser(
      { email, firstName, lastName, authorities },
      token
    );
    if (!userId) {
      return false;
    }

    const tenantId = reqUser.tenantId

    return await TenantDAO.createWithCreateUid(userId, reqUser.userId, {
      ...restOptions,
      email,
      tenantId,
    });
  },

  async register(userId, options) {
    const { email } = options;

    if (await TenantDAO.existsByEmail(email)) {
      return false;
    }
    return await TenantDAO.create(userId, options);
  },

  async update(tenantId, options, token) {
    const {
      email,
      firstName,
      lastName,
      deleted = false,
      ...restOptions
    } = options;
    const updatedTenant = await TenantDAO.get(tenantId);

    if (!updatedTenant) {
      return false
    }

    await AuthApi.updateUser(
      updatedTenant.userId,
      {
        email,
        firstName,
        lastName,
        deleted,
      },
      token
    );
    
    return await TenantDAO.update(tenantId, restOptions);
  },

  async delete(tenantId, token) {
    const tenantUser = await TenantDAO.get(tenantId);
    if (tenantUser.userId) {
      await AuthApi.deleteUser(tenantUser.userId, token);
      return await TenantDAO.delete(tenantId);
    }
    return false;
  },
};

module.exports = TenantService;
