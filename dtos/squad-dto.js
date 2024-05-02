module.exports = class SquadTeamDto {
    id;
	name;
    statistics;
    members;

    constructor(model) {
        this.id = model._id;
        this.name = model.name;
        this.statistics = model.statistics;
        this.members = model.members;

    }
}


