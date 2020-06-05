const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 100
    },
    password: { 
        type: String, 
        required: true,
        minlength: 5,
        maxlength: 100
    },
    isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this.id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));                      // Создание jwt токена, когда юзер заходит в систему
    return token;
}

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = {
        name: Joi.string().min(3).max(100).required(),
        email: Joi.string().min(5).max(100).required().email(),
        password: Joi.string().min(5).max(100).required()                           
    };
  
    return Joi.validate(user, schema);                                 
}

exports.User = User;
exports.validate = validateUser;