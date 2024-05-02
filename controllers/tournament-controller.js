const tournamentService = require('../service/tournament-service');
const userService = require('../service/user-service')
const { ObjectId } = require('mongoose')

class TournamentController {
	async addTournament(req, res, next) {
		try {
			const {
				name,
				image,
				startDate,
				map,
				tournamentType,
				maxPlayers,
				minPlayers,
				tourState,
				endState,
				fee,
			} = req.body

			const tournamentData = await tournamentService.addTournament(
				name,
				image,
				startDate,
				map,
				tournamentType,
				maxPlayers,
				minPlayers,
				tourState,
				endState,
				fee
			)
			return res.json(tournamentData)
		} catch (e) {
			console.log(e)
		}
	}

	async getTournaments(req, res, next) {
		try {
			const tournaments = await tournamentService.getAllTournaments()
			return res.json(tournaments)
		} catch (error) {
			console.log(error)
		}
	}

	async getTournamentById(req, res) {
		try {
			const { tournamentId } = req.params
			const tournament = await tournamentService.getTournamentById(tournamentId)

			if (!tournament) {
				return res.status(404).json({ message: 'Турнир не найден' })
			}

			return res.json(tournament)
		} catch (error) {
			console.error('Error:', error)
			return res.status(500).json({ message: 'Internal server error' })
		}
	}

	async participateInTournament(req, res) {
		try {
			const { tournamentId } = req.params
			const {
				participantId,
				participantNick,
				participantAvatar,
				participantName,
				participantPhone,
				participantPubgId,
				participantCheckImage,
			} = req.body

			const updatedTournament =
				await tournamentService.addParticipantToTournament(
					tournamentId,
					participantId,
					participantNick,
					participantAvatar,
					participantName,
					participantPhone,
					participantPubgId,
					participantCheckImage
				)

			res.json(updatedTournament)
		} catch (error) {
			console.error(error)

			if (error.message === 'Участник уже существует в турнире.') {
				res.status(400).json({ message: 'Вы уже участвуете в этом турнире' })
			} else {
				res
					.status(500)
					.json({ message: 'Произошла ошибка при участии в турнире' })
			}
		}
	}
}
module.exports = new TournamentController();