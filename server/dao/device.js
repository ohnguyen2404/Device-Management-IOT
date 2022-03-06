const {Op} = require("sequelize")
const {Device, DeviceCredentials, CustomerDevice, TenantDevice, Customer, Tenant} = require("../models")
const DeviceCredentialsService = require("../services/deviceCredentials")
const logger = require("../helpers/logger")

const DeviceDAO = {
    async getAll() {
        const deviceQuery = {
            include: [
                {
                    model: DeviceCredentials,
                    required: true,
                    as: "deviceCredentials",
                },
                {
                    model: CustomerDevice,
                    attributes: ["customerId"],
                    as: "deviceCustomers",
                },
                {
                    model: TenantDevice,
                    attributes: ["tenantId"],
                    as: "deviceTenants",
                },
            ],
        }

        return await Device.findAll(deviceQuery, {raw: true})
    },

    async getByFirstTenantId(firstTenantId) {
        const deviceQuery = {
            where: {
                firstTenantId,
            },
            include: [
                {
                    model: DeviceCredentials,
                    required: true,
                    as: "deviceCredentials",
                },
                {
                    model: CustomerDevice,
                    attributes: ["customerId"],
                    as: "deviceCustomers",
                },
                {
                    model: TenantDevice,
                    attributes: ["tenantId"],
                    as: "deviceTenants",
                },
            ],
        }

        return await Device.findAll(deviceQuery, {raw: true})
    },

    async getByDeviceIds(deviceIds) {
        const deviceQuery = {
            where: {
                id: deviceIds,
            },
            include: [
                {
                    model: DeviceCredentials,
                    required: true,
                    as: "deviceCredentials",
                },
                {
                    model: CustomerDevice,
                    attributes: ["customerId"],
                    as: "deviceCustomers",
                    include: {
                        model: Customer,
                    },
                },
                {
                    model: TenantDevice,
                    attributes: ["tenantId"],
                    as: "deviceTenants",
                    include: {
                        model: Tenant,
                    },
                },
            ],
        }

        return await Device.findAll(deviceQuery, {raw: true})
    },

    async getByIdWithoutCredentials(deviceId) {
        try {
            return await Device.findByPk(deviceId, {raw: true})
        } catch (e) {
            logger.error(e.message)
            return false
        }
    },

    async getById(deviceId) {
        try {
            return await Device.findByPk(
                deviceId,
                {
                    include: {
                        model: DeviceCredentials,
                        required: true,
                        as: "deviceCredentials",
                    },
                },
                {raw: true}
            )
        } catch (e) {
            logger.error(e.message)
            return false
        }
    },

    async getByName(name) {
        try {
            return await Device.findOne({
                where: {name},
            })
        } catch (e) {
            logger.error(e.message)
            return false
        }
    },

    async create(reqTenant, options) {
        try {
            console.log("create device options", options)
            return await Device.create({
                ...options,
                firstTenantId: reqTenant.firstTenantId,
                tenantId: reqTenant.id,
                createUid: reqTenant.userId,
            })
        } catch (e) {
            logger.error(e.message)
            return false
        }
    },

    async update(deviceId, options) {
        try {
            return await Device.update({...options}, {where: {id: deviceId}})
        } catch (e) {
            logger.error(e.message)
            return false
        }
    },

    async delete(deviceId) {
        try {
            await Device.update({deleted: true}, {where: {id: deviceId}})
            return true
        } catch (e) {
            logger.error(e.message)
            return false
        }
    },

    async getByNameExcludeOwnId(deviceName, deviceId) {
        try {
            return await Device.findOne({
                where: {
                    name: deviceName,
                    id: {[Op.ne]: deviceId},
                },
            })
        } catch (e) {
            logger.error(e.message)
            return false
        }
    },

    async getDeviceCustomers(deviceId) {
        try {
            const customers = await CustomerDevice.findAll({
                where: {
                    deviceId,
                },
                attributes: ["customerId"],
                include: [
                    {
                        model: Customer,
                        required: true,
                    },
                ],
                //raw: true,
            })
            return customers
        } catch (e) {
            logger.error(e.message)
            return false
        }
    },

    async getCustomerDevices(customerId) {
        try {
            const assignedDevices = await CustomerDevice.findAll({
                where: {
                    customerId,
                },
                attributes: ["deviceId"],
                raw: true,
            })
            return assignedDevices.map((d) => d.deviceId)
        } catch (e) {
            logger.error(e.message)
            return false
        }
    },

    async getDeviceTenants(deviceId) {
        try {
            const tenants = await TenantDevice.findAll({
                where: {
                    deviceId,
                },
                attributes: ["tenantId"],
                include: [
                    {
                        model: Tenant,
                        required: true,
                    },
                ],
                //raw: true,
            })
            return tenants
        } catch (e) {
            logger.error(e.message)
            return false
        }
    },

    async getTenantDevices(tenantId) {
        try {
            const assignedDevices = await TenantDevice.findAll({
                where: {
                    tenantId,
                },
                attributes: ["deviceId"],
                raw: true,
            })

            const tenantDevices = await Device.findAll({
                where: {
                    tenantId,
                },
                attributes: ["id"],
                raw: true,
            })

            const tenantDeviceIds = tenantDevices.map((d) => d.id)
            const assignedDeviceIds = assignedDevices.map((d) => d.deviceId)

            return [...assignedDeviceIds, ...tenantDeviceIds]
        } catch (e) {
            logger.error(e.message)
            return false
        }
    },

    async assignTenantsToDevice(tenantIds, deviceId) {
        try {
            const createRecords = tenantIds.map((t) => {
                return {
                    tenantId: t,
                    deviceId,
                }
            })
            return await TenantDevice.bulkCreate(createRecords)
        } catch (e) {
            logger.error(e.message)
            return false
        }
    },

    async unassignTenantsFromDevice(tenantIds, deviceId) {
        try {
            return await TenantDevice.destroy({
                where: {
                    deviceId,
                    tenantId: tenantIds,
                },
            })
        } catch (e) {
            logger.error(e.message)
            return false
        }
    },

    async assignCustomersToDevice(customerIds, deviceId) {
        try {
            const createRecords = customerIds.map((c) => {
                return {
                    customerId: c,
                    deviceId,
                }
            })
            return await CustomerDevice.bulkCreate(createRecords)
        } catch (e) {
            logger.error(e.message)
            return false
        }
    },

    async unassignCustomersFromDevice(customerIds, deviceId) {
        try {
            return await CustomerDevice.destroy({
                where: {
                    deviceId,
                    customerId: customerIds,
                },
            })
        } catch (e) {
            logger.error(e.message)
            return false
        }
    },

    async getOrCreateDeviceByName(name, tenantId, firstTenantId, label) {
        const existDevice = await Device.findOne({
            where: {name, tenantId},
        })

        if (!existDevice) {
            const newDevice = await Device.create({
                name,
                tenantId,
                firstTenantId,
                label,
            })

            await DeviceCredentialsService.create({deviceId: newDevice.id})

            return this.getById(newDevice.id)
        }

        return this.getById(existDevice.id)
    },
}

module.exports = DeviceDAO
