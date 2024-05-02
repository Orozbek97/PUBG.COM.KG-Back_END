module.exports = class TournamentDto {
    id;
    name;
    image;
    startDate;
    map;
    tournamentType;
    maxPlayers;
    minPlayers;
    tourState;
    endState;
    fee;
    participants;

    constructor(model)  {
            this.id = model._id;
            this.name = model.name;
            this.image = model.image;
            this.startDate = model.startDate;
            this.map = model.map;
            this.tournamentType = model.tournamentType;
            this.maxPlayers = model.maxPlayers;
            this.minPlayers = model.minPlayers;
            this.tourState = model.tourState;
            this.endState = model.endState;
            this.fee = model.fee;
            this.participants = model.participants;

    }
}