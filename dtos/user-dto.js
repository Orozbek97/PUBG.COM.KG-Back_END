module.exports = class UserDto {
	name
	image
	email
	id
	pubgNick
	pubgId
	phoneNumber
	isActivated
	tournaments
	statistic
	constructor(model) {
		this.name = model.name
		this.image = model.image
		this.email = model.email
		this.id = model._id
		this.pubgNick = model.pubgNick
		this.pubgId = model.pubgId
		this.phoneNumber = model.phoneNumber
		this.isActivated = model.isActivated
		this.tournaments = model.tournaments
		this.statistic = model.statistic
		
	}
}