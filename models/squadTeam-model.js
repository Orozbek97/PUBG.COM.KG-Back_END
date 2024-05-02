const { Schema, model } = require('mongoose')

const SquadTeamSchema = new Schema({
	name: { type: String, unique: true, required: true },
	statistics: {
		amountFirstPlace: { type: Number, default: 0 },
		amountSecondPlace: { type: Number, default: 0 },
		amountThirdPlace: { type: Number, default: 0 },
		amountKill: { type: Number, default: 0 },
		amountGame: { type: Number, default: 0 },
		sumPrizeMoney: { type: Number, default: 0 },
	},
	members: [
		{
			userId: { type: Schema.Types.ObjectId, ref: 'User' },
			playerName: { type: String, required: true },
			playerNick: { type: String, required: true },
			isAdmin: { type: Boolean, default: false },
		},
	],
})

SquadTeamSchema.path('members').validate(function (value) {
	return value.length <= 4
}, 'Количество участников не может превышать 4.')

module.exports = model('SquadTeam', SquadTeamSchema)
