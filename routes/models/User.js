const mongoose = require('mongoose')
const Schema = mongoose.Schema;

//Create new Schema
const UserSchema = new Schema({
    name: {
        type: String, 
        required: true
    }, 
    email: {
        type: String, 
        required: true
    }, 
    password: {
        type: String
        required: true
    }, 
    password2: {
        type: String,
        required: true
    }, 
    relationship: {
        type: String, 
    }
})

module.exports = User = mongoose.model('users', UserSchema)