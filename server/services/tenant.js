const TenantDAO = require("../dao/tenant")
const AuthApi = require("../external-api/auth")
const constant = require("../helpers/constant")

const TenantService = {
    async getAll(userTenant) {
        const {authorities, id: userTenantId, firstTenantId} = userTenant
        if (authorities.includes(constant.ROLE_ADMIN)) return await TenantDAO.getAll()

        if (authorities.includes(constant.ROLE_TENANT)) {
            // Is first class tenant
            if (userTenantId === firstTenantId) {
                return await TenantDAO.getAllByFirstTenantId(userTenantId)
            }
            return await TenantDAO.getAllByTenantId(userTenantId)
        }

        return false
    },

    async getById(tenantId, token) {
        const tenant = await TenantDAO.getById(tenantId)
        const user = await AuthApi.getUser(tenant.userId, token)

        return {
            ...tenant,
            ...user,
        }
    },

    async getByUserId(userId) {
        return await TenantDAO.getByUserId(userId)
    },

    async create(reqTenant, options, token) {
        const {email, firstName, lastName, authorities, ...restOptions} = options

        const {id: reqTenantId, firstTenantId, userId: reqTenantUserId} = reqTenant

        const createTenant = await TenantDAO.createWithCreateUid(reqTenantUserId, {
            ...restOptions,
            email,
            tenantId: reqTenantId,
            firstTenantId,
        })

        // call external-api to create new user and retreive userId
        const userId = await AuthApi.createUser(
            {email, firstName, lastName, authorities, tenantId: createTenant.id},
            token
        )

        await TenantDAO.update(createTenant.id, {userId})

        if (!userId) {
            return false
        }

        return await this.getById(createTenant.id)
    },

    async register(userId, options) {
        const {email} = options

        if (await TenantDAO.existsByEmail(email)) {
            return false
        }
        return await TenantDAO.register(userId, email)
    },

    async update(tenantId, options, token) {
        const {email, firstName, lastName, deleted = false, ...restOptions} = options
        const updatedTenant = await TenantDAO.getById(tenantId)

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
        )

        await TenantDAO.update(tenantId, restOptions)

        return await this.getById(tenantId)
    },

    async delete(tenantId, token) {
        const tenantUser = await TenantDAO.getById(tenantId)
        if (tenantUser.userId) {
            await AuthApi.deleteUser(tenantUser.userId, token)
            return await TenantDAO.delete(tenantId)
        }
        return false
    },
}

module.exports = TenantService
