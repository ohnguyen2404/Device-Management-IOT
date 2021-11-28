const User = require("../models").User

const UserService = {
	
	async createUser(user) {
    const { username, email, password } = user
		await User.create({username, email, password})
	},

	async updateUser(userId, info) {
		const user = await User.findByPk(userId)
		if (!user) {
			return false
		}
		await user.update({...info})

		return true
	},

	async deleteUser(userId) {
		const user = await User.findByPk(userId)
		if (!user) {
			return false
		}
		await user.destroy()

		return true
	}
}

module.exports = UserService