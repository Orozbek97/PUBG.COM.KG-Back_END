const { validationResult } = require("express-validator")
const ApiError = require("../exceptions/api-error")
const AdminService = require('../service/admin-service')
const adminService = require("../service/admin-service")
const { emit } = require("../models/admin-model")

class AdminController {
	async registration(req, res, next) {
		try {
			const errors = validationResult(req)
			if (!errors.isEmpty) {
				return next(ApiError.BadRequest('Ошибка при Валидации', errors.array()))
			}
			const { login, password } = req.body
			const adminData = await AdminService.registration(login, password)
			res.cookie('refreshToken', adminData.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
			})
			return res.json(adminData)
		} catch (e) {
			next(e)
		}
	}

	async login(req, res, next) {
		try {
			const { login, password } = req.body
			const adminData = await adminService.login(login, password)
			res.cookie('refreshToken', adminData.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
			})
			return res.json(adminData)
		} catch (e) {
			next(e)
		}
	}

	async logout(req, res, next) {
		try {
			const { refreshToken } = req.cookies
			const token = await adminService.logout(refreshToken)
			res.clearCookie('refreshToken')
			return res.json(token)
		} catch (e) {
			next(e)
		}
	}

	async refresh(req, res, next) {
		try {
			const { refreshToken } = req.cookies
			const adminData = await adminService.refresh(refreshToken)
			res.cookie('refreshToken', adminData.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
			})
			return res.json(adminData)
		} catch (e) {
			next(e)
		}
	}

	async completeTournament(req, res, next) {
		try {
			const { tournamentId } = req.params
			await adminService.completeTournament(tournamentId)

			return res.json({ message: 'Турнир успешно завершен' })
		} catch (error) {
			next(error)
			console.error(error)
		}
	}

	async addResults(req, res, next) {
		try {
			const { tournamentId } = req.params
			const {
				participantId,
				participantKill,
				participantMoney,
				participantPlace,
			} = req.body

			const updatedTournament = await AdminService.addResults(
				tournamentId,
				participantId,
				participantKill,
				participantMoney,
				participantPlace
			)

			res.status(200).json({
				message: 'Результаты участника успешно добавлены',
				tournament: updatedTournament,
			})
		} catch (error) {
			console.error('Ошибка при добавлении результатов участника:', error)
			res.status(500).json({ error: 'Внутренняя ошибка сервера' })
		}
	}

	async addTopPlace(req, res, next) {
		try {
			const { userId } = req.params

			const {
				newFirstPlace,
				newSecondPlace,
				newThirdPlace
			} = req.body

			const updateTopPlace = await adminService.addTopPlace(
				userId,
				newFirstPlace,
				newSecondPlace,
				newThirdPlace
			)
			res.status(200).json({
				message: 'Результаты участника успешно добавлены',
				user: updateTopPlace,
			})
			
		} catch (error) {
			console.error('Ошибка при добавлении результатов участника:', error)
			res.status(500).json({ error: 'Внутренняя ошибка сервера' })
		}
	}

	async removeParticipant(req, res, next) {
		try {
			const { tournamentId } = req.params
			const { userId } = req.params

			const result = await adminService.removeParticipant(tournamentId, userId)

			return res.json(result)
		} catch (error) {
			console.error('Ошибка при удалении участника из турнира:', error)
			return res
				.status(500)
				.json({
					success: false,
					message: 'Произошла ошибка при удалении участника из турнира',
				})
		}
	}

	async deletePlayer(req, res, next) {
		 try {
				const { userId } = req.params
				const result = await adminService.deletePlayer(userId)

				res.status(200).json(result)
			} catch (error) {
				console.error('Ошибка при удалении пользователя:', error)
	
			}
	}
}


module.exports = new AdminController();