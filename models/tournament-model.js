const { type } = require('express/lib/response');
const { Schema, model } = require('mongoose');

const tournamentSchema = new Schema({
	name: { type: String, required: true },
	image: { type: String, required: true },
	startDate: { type: Date, required: true },
	map: { type: String, required: true },
	tournamentType: { type: String, required: true },
	maxPlayers: { type: Number, required: true },
	minPlayers: { type: Number, required: true },
	tourState: { type: Boolean, required: true, default: true },
	endState: {type: Boolean, default: false},
	fee: { type: Number, required: true },
	participants: [
		{
			userId: { type: Schema.Types.ObjectId, ref: 'User' },
			pubgNick: { type: String },
			avatar: { type: String },
			name: { type: String },
			phone: { type: Number },
			pubgId: { type: Number },
			checkImage: { type: String },
			kill: { type: Number, default: 0 },
			prizeMoney: { type: Number, default: 0 },
			place: { type: Number, default: 0}
		},
	],
})

module.exports = model('Tournament', tournamentSchema);
