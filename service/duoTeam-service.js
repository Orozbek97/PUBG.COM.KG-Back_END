const DuoTeamDto =  require("../dtos/duo-dto")
const DuoTeamModel = require("../models/duoteam-model")
const ApiError = require('../exceptions/api-error')

class DuoTeamService {
	async addDuoTeam(name, statistics, members) {
		try {
			const duoName = await DuoTeamModel.findOne({ name })
			if (duoName) {
				throw ApiError.BadRequest(
					`Дуо команда с названием ${name} уже существует. Пожалуйста, выберите другое название.`
				)
			}

			const duoteam = await DuoTeamModel.create({
				name,
				statistics,
				members,
			})

			const duoTeamDto = new DuoTeamDto(duoteam)
			return { duoteam: duoTeamDto }
		} catch (error) {
			throw error
			
		}
	}

	async getDuoTeams() {
		const duoteams = await DuoTeamModel.find()
		return duoteams
	}

	async getDuoTeamsById(duoteamId) {
		try {
			const duoteam = await DuoTeamModel.findById(duoteamId)
			if (!duoteam) {
				throw ApiError.BadRequest(`Дуо команда не существует!!`)
			}
			return duoteam
		} catch (error) {
			throw error
		}
	}
}

module.exports = new DuoTeamService();
