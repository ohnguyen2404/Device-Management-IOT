const DeviceDAO = require("../dao/device")
const DeviceCredentialsService = require("../services/deviceCredentials")
const constant = require("../helpers/constant")
const logger = require("../helpers/logger")

const db = require("../models/index")

const handleDeviceAssignation = async (assignedTenantIds, assignedCustomerIds, deviceId) => {
    // Customer Device
    const existingCustomer = await DeviceDAO.getDeviceCustomers(deviceId)
    const existingTenant = await DeviceDAO.getDeviceTenants(deviceId)

    const existingCustomerIds = existingCustomer.map((c) => c.customerId)
    const existingTenantIds = existingTenant.map((t) => t.tenantId)

    if (existingCustomerIds.length === 0) {
        await DeviceDAO.assignCustomersToDevice(assignedCustomerIds, deviceId)
    } else {
        const unassignedCustomerIds = existingCustomerIds.filter((c) => !assignedCustomerIds.includes(c))
        const newAssignedCustomerIds = assignedCustomerIds.filter((c) => !existingCustomerIds.includes(c))
        try {
            await db.sequelize.transaction(async (t) => {
                await DeviceDAO.unassignCustomersFromDevice(unassignedCustomerIds, deviceId)
                await DeviceDAO.assignCustomersToDevice(newAssignedCustomerIds, deviceId)
            })
        } catch (e) {
            logger.error("assign_customer_transaction-" + e.message)
        }
    }

    if (existingTenantIds.length === 0) {
        await DeviceDAO.assignTenantsToDevice(assignedTenantIds, deviceId)
    } else {
        const unassignedTenantIds = existingTenantIds.filter((c) => !assignedTenantIds.includes(c))
        const newAssignedTenantIds = assignedTenantIds.filter((c) => !existingTenantIds.includes(c))

        try {
            await db.sequelize.transaction(async (t) => {
                await DeviceDAO.unassignTenantsFromDevice(unassignedTenantIds, deviceId)
                await DeviceDAO.assignTenantsToDevice(newAssignedTenantIds, deviceId)
            })
        } catch (e) {
            logger.error("assign_tenant_transaction-" + e.message)
        }
    }
}

const DeviceService = {
    async getAll(userEntity) {
        const {authorities, id, firstTenantId} = userEntity
        if (authorities.includes(constant.ROLE_ADMIN)) {
            return await DeviceDAO.getAll()
        }

        if (authorities.includes(constant.ROLE_CUSTOMER)) {
            const deviceIds = await DeviceDAO.getCustomerDevices(id)
            return await DeviceDAO.getByDeviceIds(deviceIds)
        }

        if (authorities.includes(constant.ROLE_TENANT)) {
            // Is first class tenant
            if (id === firstTenantId) {
                return await DeviceDAO.getByFirstTenantId(id)
            }

            const deviceIds = await DeviceDAO.getTenantDevices(id)
            return await DeviceDAO.getByDeviceIds(deviceIds)
        }
    },

    async getById(deviceId) {
        return await DeviceDAO.getById(deviceId)
    },

    async create(reqTenant, options) {
        const {credentialsType, credentialsValue, assignedTenants, assignedCustomers, ...deviceOptions} = options

        const createDevice = await DeviceDAO.create(reqTenant, deviceOptions)

        const deviceCredentialsInfo = {
            deviceId: createDevice.id,
            credentialsType,
            credentialsValue,
            createUid: reqTenant.userId,
        }
        await DeviceCredentialsService.create(deviceCredentialsInfo)

        await DeviceDAO.assignTenantsToDevice(assignedTenants, createDevice.id)

        await DeviceDAO.assignCustomersToDevice(assignedCustomers, createDevice.id)

        return await this.getById(createDevice.id)
    },

    async update(deviceId, userId, options) {
        const deviceInfo = {
            ...options,
            updateUid: userId,
        }
        const {assignedTenants, assignedCustomers} = options

        await DeviceDAO.update(deviceId, deviceInfo)

        await handleDeviceAssignation(assignedTenants, assignedCustomers, deviceId)

        return await this.getById(deviceId)
    },

    async delete(deviceId) {
        return await DeviceDAO.delete(deviceId)
    },

    async getOrCreateDevice(name, tenantId, firstTenantId, label) {
        return await DeviceDAO.getOrCreateDeviceByName(name, tenantId, firstTenantId, label)
    },
}

module.exports = DeviceService
