const TournamentModel = require ('../models/tournament-model')
const UserModel = require ('../models/user-model')
const TournamentDto = require('../dtos/tournament-dto')
const { ObjectId } = require('mongodb');


class TournamentService {
	async addTournament(
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
		participants
	) {
		const tournament = await TournamentModel.create({
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
			participants,
		})
		const tournamentDto = new TournamentDto(tournament)

		return { tournament: tournamentDto }
	}

	async getAllTournaments() {
		const tournaments = await TournamentModel.find()
		return tournaments
	}

	async getTournamentById(tournamentId) {
		try {
			const tournament = await TournamentModel.findById(tournamentId)
			return tournament
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	async  addParticipantToTournament(
    tournamentId,
    participantId,
    participantNick,
    participantAvatar,
    participantName,
    participantPhone,
    participantPubgId,
    participantCheckImage,
    participantKill,
    participantMoney,
    participantPlace
) {
    try {
        const tournament = await TournamentModel.findById(tournamentId);
        if (!tournament) {
            throw new Error('Турнир не найден');
        }

        const existingParticipant = tournament.participants.find(
            participant => String(participant.userId) === String(participantId)
        );

        if (existingParticipant) {
            throw new Error('Участник уже существует в турнире.');
        }
		        const defaultKill = 0
				const defaultPlace = 0
				const defaultMoney = 0

        // Добавление участника к турниру
        tournament.participants.push({
            userId: participantId,
            pubgNick: participantNick,
            avatar: participantAvatar,
            name: participantName,
            phone: participantPhone,
            pubgId: participantPubgId,
            checkImage: participantCheckImage,
            kill: participantKill,
            prizeMoney: participantMoney,
            place: participantPlace,
        });
        await tournament.save();

        // Обновление информации о турнире у игрока
        const user = await UserModel.findById(participantId);
        if (!user) {
            throw new Error('Пользователь не найден');
        }

        const userTournamentData = {
            tournamentId: tournament._id,
            tournamentName: tournament.name,
            tournamentDate: tournament.startDate,
            tournamentKill: defaultKill,
            tournamentPlace: defaultPlace,
            tournamentMoney: defaultMoney,
        };

        user.tournaments.push(userTournamentData);

        // Увеличение количества игр у игрока на 1
        user.statistic.game += 1;

        await user.save();

        return tournament;
    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
}

}
module.exports = new TournamentService();