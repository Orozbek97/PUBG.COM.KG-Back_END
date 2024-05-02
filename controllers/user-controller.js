const userService = require('../service/user-service');
const {validationResult} = require('express-validator');
const ApiError = require('../exceptions/api-error');

class UserController {
	async registration(req, res, next) {
		try {
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				return next(ApiError.BadRequest('Ошибка при Валидации', errors.array()))
			}
			const { name, image, email, pubgNick, pubgId, phoneNumber, password } =
				req.body
			const userData = await userService.registration(
				name,
				image,
				email,
				pubgNick,
				pubgId,
				phoneNumber,
				password
			)
			res.cookie('refreshToken', userData.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
			})
			return res.json(userData)
		} catch (e) {
			next(e)
		}
	}

	async login(req, res, next) {
		try {
			const { email, password } = req.body
			const userData = await userService.login(email, password)
			res.cookie('refreshToken', userData.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
			})
			return res.json(userData)
		} catch (e) {
			next(e)
		}
	}

	async logout(req, res, next) {
		try {
			const { refreshToken } = req.cookies
			const token = await userService.logout(refreshToken)
			res.clearCookie('refreshToken')
			return res.json(token)
		} catch (e) {
			next(e)
		}
	}

	async refresh(req, res, next) {
		try {
			const { refreshToken } = req.cookies
			const userData = await userService.refresh(refreshToken)
			res.cookie('refreshToken', userData.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
			})
			return res.json(userData)
		} catch (e) {
			next(e)
		}
	}

	async activate(req, res, next) {
		try {
			const activationLink = req.params.link
			await userService.activate(activationLink)
			return res.redirect(process.env.CLIENT_URL)
		} catch (e) {
			next(e)
		}
	}

	async getUsers(req, res, next) {
		try {
			const users = await userService.getAllUsers()
			return res.json(users)
		} catch (e) {
			next(e)
		}
	}

	async getPlayerById(req, res) {
		try {
			const { playerId } = req.params
			const player = await userService.getPlayerById(playerId)

			if (!player) {
				return res.status(404).json({ message: 'Игрок не найден' })
			}

			return res.json(player)
		} catch (error) {
			console.error('Error:', error)
			return res.status(500).json({ message: 'Серверная ошибка' })
		}
	}

	async sendPasswordResetMail(req, res, next) {
		const { email } = req.body
		try {
			await userService.sendPasswordResetMail(email)
			res.status(200).json({
				message:
					'Ссылка для сброса пароля отправлена на указанный адрес электронной почты',
			})
		} catch (error) {
			next(error)
		}
	}

	async changePassword(req, res, next) {
		try {
			const { userId } = req.params
			const { newPassword } = req.body

			const message = await userService.changePassword(userId, newPassword)

			
			res.status(200).json({
				message: message,
			})
		} catch (error) {
			next(error)
		}
	}
}



module.exports = new UserController();