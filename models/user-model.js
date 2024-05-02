const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
	name: { type: String, required: true },
	image: { type: String, required: true},
	email: { type: String, unique: true, required: true },
	pubgNick: { type: String, required: true },
	pubgId: { type: Number, required: true },
	phoneNumber: { type: Number, required: true },
	password: { type: String, required: true },
	isActivated: { type: Boolean, default: false },
	activationLink: { type: String },
	tournaments: [
			{
				tournamentId: { type: Schema.Types.ObjectId, ref: 'Tournament' },
				tournamentName: { type: String },
				tournamentDate: { type: Date },
				tournamentKill: { type: Number },
				tournamentPlace: { type: Number },
				tournamentMoney: { type: Number }
			},
	],
	statistic: {
				game: { type: Number, default: 0 },
				kill: { type: Number, default: 0 },
				firstPlace: { type: Number, default: 0 },
				secondPlace: { type: Number, default: 0 },
				thirdPlace: { type: Number, default: 0 },
				prizeMoney: { type: Number, default: 0 }
	},
				
	
});

module.exports = model('User', UserSchema);
