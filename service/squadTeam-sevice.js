const SquadTeamModel = require('../models/squadTeam-model')
const SquadTeamDto = require('../dtos/squad-dto')
const ApiError = require('../exceptions/api-error')

class SquadTeamService {
	async addSquadTeam(name, statistics, members) {
		try {
			const squadName = await SquadTeamModel.findOne({ name })
			if (squadName) {
				throw ApiError.BadRequest(
					`Отряд с названием ${name} уже существует. Пожалуйста, выберите другое название.`
				)
			}


			const squadteam = await SquadTeamModel.create({
				name,
				statistics,
				members,
			})


			const squadTeamDto = new SquadTeamDto(squadteam)
			return { squadteam: squadTeamDto }
		} catch (error) {
			throw error
		}
	}

	async getSquadTeams() {
		const squadteams = await SquadTeamModel.find()
		return squadteams
 	}

	
	async getSquadTeamsById(squadteamId) {
		try {
			const squadteam = await SquadTeamModel.findById(squadteamId)
			if (!squadteam) {
			  throw	ApiError.BadRequest(
				`Отряд не существует!!`
			  )
			}
			return squadteam
		} catch (error) {
			throw error
		}
	}
}

module.exports = new SquadTeamService()
