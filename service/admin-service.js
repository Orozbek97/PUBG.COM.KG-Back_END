const ApiError = require('../exceptions/api-error');
const AdminModel = require('../models/admin-model');
const { create } = require('../models/token-model');
const AdminDto = require('../dtos/admin-dto');
const tokenService = require('./token-service');
const bcrypt = require('bcrypt');
const tournamentModel = require('../models/tournament-model');
const userModel = require('../models/user-model');
const tokenModel = require('../models/token-model');

class AdminService {
	async registration(login, password) {
		const candidateAdmin = await AdminModel.findOne({ login })
		if (candidateAdmin) {
			throw ApiError.BadRequest(`Админ с таким именем ${login} уже есть`)
		}

		const hashPassword = await bcrypt.hash(password, 4)

		const admin = await AdminModel.create({
			login,
			password: hashPassword,
		})

		const adminDto = new AdminDto(admin)
		const tokens = tokenService.generateTokens({ ...adminDto })
		await tokenService.saveToken(adminDto.id, tokens.refreshToken)

		return { ...tokens, admin: adminDto }
	}

	async login(login, password) {
		const admin = await AdminModel.findOne({ login })
		if (!login) {
			throw ApiError.BadRequest('Администратор с таким именем не найден')
		}
		const isPassEquals = await bcrypt.compare(password, admin.password)
		if (!isPassEquals) {
			throw ApiError.BadRequest('Неверный пароль')
		}

		const adminDto = new AdminDto(admin)
		const tokens = tokenService.generateTokens({ ...adminDto })

		await tokenService.saveToken(adminDto.id, tokens.refreshToken)
		return { ...tokens, admin: adminDto }
	}

	async logout(refreshToken) {
		const token = await tokenService.removeToken(refreshToken)
		return token
	}

	async refresh(refreshToken) {
		if (!refreshToken) {
			throw ApiError.UnauthorizedError()
		}
		const adminData = tokenService.validateRefreshToken(refreshToken)
		const tokenFromDb = await tokenService.findToken(refreshToken)
		if (!adminData || !tokenFromDb) {
			throw ApiError.UnauthorizedError()
		}
		const admin = await AdminModel.findById(adminData.id)
		const adminDto = new AdminDto(admin)
		const tokens = tokenService.generateTokens({ ...adminDto })

		await tokenService.saveToken(adminDto.id, tokens.refreshToken)
		return { ...tokens, admin: adminDto }
	}

	async completeTournament(tournamentId) {
		const tournament = await tournamentModel.findById(tournamentId)
		if (!tournament) {
			throw ApiError.BadRequest('Турнир не найден')
		}
		if (tournament.endState) {
			tournament.endState = false
		} else {
			tournament.endState = true
		}

		await tournament.save()

		return tournament
	}

	async addResults(
		tournamentId,
		participantId,
		newKill,
		newPrizeMoney,
		newPlace
	) {
		try {
			const tournament = await tournamentModel.findById(tournamentId)
			if (!tournament) {
				throw new Error('Турнир не найден')
			}

			const participant = tournament.participants.find(
				participant => participant._id.toString() === participantId
			)

			if (!participant) {
				throw new Error('Участник не найден')
			}

			// Обновляем данные участника в модели Tournament
			participant.kill = newKill
			participant.prizeMoney = newPrizeMoney
			participant.place = newPlace

			await tournament.save()

			// Обновляем данные участника в модели User
			await userModel.updateOne(
				{ _id: participant.userId, 'tournaments.tournamentId': tournamentId },
				{
					$set: {
						'tournaments.$.tournamentKill': newKill,
						'tournaments.$.tournamentMoney': newPrizeMoney,
						'tournaments.$.tournamentPlace': newPlace,
					},
					$inc: {
						'statistic.kill': newKill,
						'statistic.prizeMoney': newPrizeMoney,
					},
				}
			)

			return tournament
		} catch (error) {
			console.error('Ошибка при обновлении результатов участника:', error)
			throw error
		}
	}

	async addTopPlace(
		userId, 
		newFirstPlace,
		newSecondPlace,
		newThirdPlace,
	) {
		try {
			const user = await userModel.findById(userId);
			
			 if (!user) {
					throw new Error('Пользователь не найден')
				}

			await userModel.updateOne(
				{ _id: userId },
				{
					$inc: {
						'statistic.firstPlace': newFirstPlace,
						'statistic.secondPlace': newSecondPlace,
						'statistic.thirdPlace': newThirdPlace,
					},
				}
			)

			return user
			
		} catch (error) {
				console.error('Ошибка при обновлении результатов участника:', error)
				throw error
		}
	}

	async removeParticipant(tournamentId, userId) {
		try {
			const tournament = await tournamentModel.findById(tournamentId)
			const user = await userModel.findById(userId)
			if (!tournament || !user) {
				throw new Error('Турнир или Участник не найден')
			}

			user.tournaments = user.tournaments.filter(
				tournament => tournament.tournamentId.toString() !== tournamentId
			)
			user.statistic.game -= 1
			await user.save()

			tournament.participants = tournament.participants.filter(
				participant => participant.userId.toString() !== userId
			)
			await tournament.save()

			return {
				success: true,
				message: 'Участник удален из турнира и турнир из участника',
			}
		} catch (error) {
			throw new Error(
				'Ошибка при удалении участника из турнира: ' + error.message
			)
		}
	}

	async deletePlayer(userId) {
		try {
			const result = await userModel.deleteOne({ _id: userId })
			if (result.deletedCount === 0) {
				throw new Error('Пользователь не найден')
			}

			await tokenModel.deleteMany({ user: userId })

			return {
				success: true,
				message: 'Пользователь успешно удален!',
			}
		} catch (error) {
			console.error('Ошибка при удалении пользователя:', error)
			throw error
		}
	}
}



module.exports = new AdminService();