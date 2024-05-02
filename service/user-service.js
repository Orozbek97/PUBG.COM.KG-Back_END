const UserModel = require('../models/user-model');
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const mailService = require('./mail-service')
const tokenService = require('./token-service')
const UserDto = require('../dtos/user-dto')
const ApiError = require('../exceptions/api-error')
const {response} = require("express");


class UserService {
	async registration(
		name,
		image,
		email,
		pubgNick,
		pubgId,
		phoneNumber,
		password,
		tournaments,
		statistic
	) {
		const candidateEmail = await UserModel.findOne({ email })
		if (candidateEmail) {
			throw ApiError.BadRequest(
				`Пользователь с почтовым адресом ${email} уже существует!`
			)
		}

		const hashPassword = await bcrypt.hash(password, 3)
		const activationLink = uuid.v4()
		try {
			await mailService.sendActivationMail(
				email,
				`${process.env.API_URL}/add/activate/${activationLink}`
			)
		} catch (error) {
			throw ApiError.MailSendError()
		}

		const user = await UserModel.create({
			name,
			image,
			email,
			pubgNick,
			pubgId,
			phoneNumber,
			password: hashPassword,
			activationLink,
			tournaments,
			statistic,
		})

		const userDto = new UserDto(user)
		const tokens = tokenService.generateTokens({ ...userDto })
		await tokenService.saveToken(userDto.id, tokens.refreshToken)

		return { ...tokens, user: userDto }
	}

	async activate(activationLink) {
		const user = await UserModel.findOne({ activationLink })
		if (!user) {
			throw ApiError.BadRequest('Некорректная ссылка активации')
		}
		user.isActivated = true
		await user.save()
	}

	async login(email, password) {
		const user = await UserModel.findOne({ email })
		if (!user) {
			throw ApiError.BadRequest('Пользователь с таким email не найден')
		}
		const isPassEquals = await bcrypt.compare(password, user.password)
		if (!isPassEquals) {
			throw ApiError.BadRequest('Неверный пароль')
		}
		const userDto = new UserDto(user)
		const tokens = tokenService.generateTokens({ ...userDto })

		await tokenService.saveToken(userDto.id, tokens.refreshToken)
		return { ...tokens, user: userDto }
	}

	async logout(refreshToken) {
		const token = await tokenService.removeToken(refreshToken)
		return token
	}

	async refresh(refreshToken) {
		if (!refreshToken) {
			throw ApiError.UnauthorizedError()
		}
		const userData = tokenService.validateRefreshToken(refreshToken)
		const tokenFromDb = await tokenService.findToken(refreshToken)
		if (!userData || !tokenFromDb) {
			throw ApiError.UnauthorizedError()
		}
		const user = await UserModel.findById(userData.id)
		const userDto = new UserDto(user)
		const tokens = tokenService.generateTokens({ ...userDto })

		await tokenService.saveToken(userDto.id, tokens.refreshToken)
		return { ...tokens, user: userDto }
	}

	async getAllUsers() {
		const users = await UserModel.find()
		return users
	}
	async getPlayerById(playerId) {
		try {
			const player = await UserModel.findById(playerId)
			return player
		} catch (error) {
			console.log(error)
		}
	}

	async sendPasswordResetMail(email) {
		const candidateEmail = await UserModel.findOne({ email })
		if (!candidateEmail) {
			throw ApiError.BadRequest(
				`Пользователь с почтовым адресом ${email} не существует!`
			)
		}
		const sendPasswordResetMail = uuid.v4()
		const userId = candidateEmail._id
		try {
			await mailService.sendPasswordResetMail(
				email,
				`${process.env.CLIENT_URL}/reset/password/mail/${userId}/${sendPasswordResetMail}`
			)
		} catch (error) {
			throw ApiError.MailSendError()
		}
	}

	async changePassword(userId, newPassword) {
		const user = await UserModel.findById(userId)
		if (!user) {
			throw new Error('Пользователь не найден')
		}

		const hashPassword = await bcrypt.hash(newPassword, 10)


		user.password = hashPassword

		await user.save()

		return 'Пароль успешно изменен'
	}
}

module.exports = new UserService();