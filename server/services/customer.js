const CustomerDAO = require("../dao/customer")
const TenantDAO = require("../dao/tenant")
const AuthApi = require("../external-api/auth")
const constant = require("../helpers/constant")

const CustomerService = {
    async getAll(reqUser) {
        const {authorities, id} = reqUser
        if (authorities.includes(constant.ROLE_ADMIN)) return await CustomerDAO.getAll()

        let customerList = []

        if (authorities.includes(constant.ROLE_TENANT)) {
            const customers = await CustomerDAO.getAllByTenantId(id)
            customerList = [...customerList, ...customers]
        }

        if (authorities.includes(constant.ROLE_CUSTOMER)) {
            const customers = await CustomerDAO.getAllByCustomerId(id)
            customerList = [...customerList, ...customers]
        }
        return customerList
    },

    async getById(customerId, token) {
        const customer = await CustomerDAO.getById(customerId)
        const user = await AuthApi.getUser(customer.userId, token)

        return {
            ...customer,
            ...user,
        }
    },

    async getByUserId(userId) {
        return await CustomerDAO.getByUserId(userId)
    },

    async create(reqUser, options, token) {
        const {email, firstName, lastName, authorities, ...restOptions} = options
        const {authorities: reqUserAuthorities, id: reqUserId} = reqUser
        let tenantId = null
        let customerId = null

        if (reqUserAuthorities.includes(constant.ROLE_CUSTOMER)) {
            customerId = reqUserId
        }

        if (reqUserAuthorities.includes(constant.ROLE_TENANT)) {
            tenantId = reqUserId
        }

        // call external-api to create new user and retreive userId
        const userId = await AuthApi.createUser(
            {email, firstName, lastName, authorities, tenantId, customerId},
            token
        )

        if (!userId) {
            return false
        }

        const createCustomer = await CustomerDAO.createWithCreateUid(userId, reqUser.userId, {
            ...restOptions,
            email,
            tenantId,
            customerId,
        })

        return await this.getById(createCustomer.id)
    },

    async update(customerId, options, token) {
        const {email, firstName, lastName, deleted = false, ...restOptions} = options
        const updatedCustomer = await CustomerDAO.getById(customerId)

        if (!updatedCustomer) {
            return false
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
        )

        await CustomerDAO.update(customerId, restOptions)

        return await this.getById(customerId)
    },

    async delete(customerId, token) {
        const customerUser = await CustomerDAO.getById(customerId)
        if (customerUser.userId) {
            await AuthApi.deleteUser(customerUser.userId, token)
            return await CustomerDAO.delete(customerId)
        }
        return false
    },
}

module.exports = CustomerService
