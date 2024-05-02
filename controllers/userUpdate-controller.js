const userUpdateService = require("../service/userUpdate-service")



class UserUpdateController {

	async updateProfile(req, res, next) {
		try {
			const {userId} = req.params
			const { name, pubgNick, pubgId, phoneNumber } = req.body 

			const user = await userUpdateService.updateProfile(
				userId,
				name,
				pubgNick,
				pubgId,
				phoneNumber
			)

			res.json(user)
		} catch (error) {
			next(error) 
		}
	}

	async updateAvatar(req, res, next) {
		try {
			const {userId} = req.params
			const { image } = req.body 

			const user = await userUpdateService.updateAvatar(
				userId,
				image
			)

			res.json(user)
		} catch (error) {
			next(error) 
		}
	}
}
module.exports = new UserUpdateController()