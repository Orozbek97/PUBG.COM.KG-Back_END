const UserModel = require('../models/user-model')
const ApiError = require('../exceptions/api-error')
const tournamentModel = require('../models/tournament-model')

class UserUpdateService {


	async updateProfile(userId, name, pubgNick, pubgId, phoneNumber) {
		try {
			const user = await UserModel.findById(userId)
			if (!user) {
				throw ApiError.BadRequest('Пользователь не найден')
			}

			user.name = name
			user.pubgNick = pubgNick
			user.pubgId = pubgId
			user.phoneNumber = phoneNumber

			await user.save()
			return user
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	async updateAvatar(userId, image) {
		try {
			const user = await UserModel.findById(userId)
			if (!user) {
				throw ApiError.BadRequest('Пользователь не найден')
			}

			user.image = image
			
			await user.save()

			  const tournaments = await tournamentModel.find({
					'participants.userId': userId,
				})
				for (const tournament of tournaments) {
					const participantIndex = tournament.participants.findIndex(
						participant => String(participant.userId) === String(userId)
					)
					if (participantIndex !== -1) {
						tournament.participants[participantIndex].avatar = image
						await tournament.save()
					}
				}

			return user
		} catch (error) {
			console.error(error)
			throw error
		}
	}

}

module.exports = new UserUpdateService()
