const { Schema, model } = require('mongoose')
const { login } = require('../service/user-service')


const AdminSchema = new Schema ({
    login: {type: String, required: true},
    password: {type: String, required: true}
})

module.exports = model('Admin', AdminSchema);