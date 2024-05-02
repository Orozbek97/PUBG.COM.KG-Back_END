const { Schema, model } = require('mongoose')

const DuoTeamSchema = new Schema({
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

DuoTeamSchema.path('members').validate(function (value) {
	return value.length <= 2
}, 'Количество участников не может превышать 2.')

module.exports = model('DuoTeam', DuoTeamSchema)
