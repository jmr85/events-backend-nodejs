'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = Schema({
    name: String,
    lastname: String
});

module.exports = mongoose.model('User', UserSchema);