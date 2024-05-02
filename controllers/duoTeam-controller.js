const e = require('cors')
const duoTeamSevice = require('../service/duoTeam-service')

class DuoTeamController {
	async addDuoTeam(req, res, next) {
		try {
			const { name } = req.body
			const duoteamData = await duoTeamSevice.addDuoTeam(name)
			return res.json(duoteamData)
		} catch (e) {
			next(e)
		}
	}

	async getDuoTeams(req, res, next) {
		try {
			const duoteams = await duoTeamSevice.getDuoTeams()
			return res.json(duoteams)
		} catch (e) {
			next(e)
		}
	}

	async getDuoTeamsById(req, res, next) {
		try {
			const { duoteamId } = req.params
			const duoteam = await duoTeamSevice.getDuoTeamsById(duoteamId)

			return res.json(duoteam)
		} catch (e) {
			next(e)
		}
	}
}

module.exports = new DuoTeamController()
