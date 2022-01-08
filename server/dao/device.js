const { Op } = require("sequelize");
const { Device, DeviceCredentials } = require("../models");

const DeviceDAO = {
  async getAll(tenantId, customerId) {
    const deviceQuery = {
      where: {
        [Op.and]: [
          { deleted: false },
          customerId ? { tenantId, customerId } : { tenantId },
        ],
      },
      include: {
        model: DeviceCredentials,
        required: true,
        as: "deviceCredentials",
      },
    };

    const devices = await Device.findAll(deviceQuery, { raw: true });

    return devices;
  },

  async getByIdWithoutCredentials(deviceId) {
    try {
      return await Device.findByPk(deviceId, { raw: true });
    } catch (e) {
      console.log("error", e.message);
      return false;
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
        { raw: true }
      );
    } catch (e) {
      console.log("error", e.message);
      return false;
    }
  },

  async getByName(name) {
    try {
      return await Device.findOne({
        where: { name },
      });
    } catch (e) {
      console.log("error", e.message);
      return false;
    }
  },

  async create(user, options) {
    console.log("options", options);

    try {
      return await Device.create({
        ...options,
        tenantId: user.tenantId,
        createUid: user.reqUserId,
      });
    } catch (e) {
      console.log("error", e.message);
      return false;
    }
  },

  async update(deviceId, options) {
    console.log("options", options);
    try {
      return await Device.update({ ...options }, { where: { id: deviceId } });
    } catch (e) {
      console.log("error", e.message);
      return false;
    }
  },

  async delete(deviceId) {
    try {
      await Device.update({ deleted: true }, { where: { id: deviceId } });
      return true;
    } catch (e) {
      console.log("error", e.message);
      return false;
    }
  },

  async getByNameExcludeOwnId(deviceName, deviceId) {
    try {
      return await Device.findOne({
        where: {
          name: deviceName,
          id: { [Op.ne]: deviceId },
        },
      });
    } catch (e) {
      console.log("error", e.message);
      return false;
    }
  },
};

module.exports = DeviceDAO;
