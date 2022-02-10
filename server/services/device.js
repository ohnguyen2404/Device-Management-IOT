const DeviceDAO = require("../dao/device")
const DeviceCredentialsService = require("../services/deviceCredentials")
const constant = require("../helpers/constant")

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
            console.log('deviceIds', deviceIds);
            return await DeviceDAO.getByDeviceIds(deviceIds)
        }
    },

    async getById(deviceId) {
        return await DeviceDAO.getById(deviceId)
    },

    async create(reqTenant, options) {
        const {credentialsType, credentialsValue, ...deviceOptions} = options

        const createDevice = await DeviceDAO.create(reqTenant, deviceOptions)

        const deviceCredentialsInfo = {
            deviceId: createDevice.id,
            credentialsType,
            credentialsValue,
            createUid: reqTenant.userId,
        }

        await DeviceCredentialsService.create(deviceCredentialsInfo)

        return await this.getById(createDevice.id)
    },

    async update(deviceId, userId, options) {
        const deviceInfo = {
            ...options,
            updateUid: userId,
        }
        await DeviceDAO.update(deviceId, deviceInfo)

        return await this.getById(deviceId)
    },

    async delete(deviceId) {
        return await DeviceDAO.delete(deviceId)
    },
}

module.exports = DeviceService
