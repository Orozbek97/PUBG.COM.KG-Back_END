
module.exports = class AdminDto {
    login
    id

    constructor(model) {
        this.login = model.login
        this.id = model._id
    }
}