const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const { User } = require('../models/user');

const router = express.Router();

router.post('/', async (request, response) => {
    const { error } = validate(request.body); 
    if (error) return response.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: request.body.email });
    if (!user) return response.status(400).send('Invalid email or password');

    const validPassword = await bcrypt.compare(request.body.password, user.password);               // Сравнение паролей
    if (!validPassword) return response.status(400).send('Invalid email or password');

    const token = user.generateAuthToken();                                                              
    response.send(token);
});

function validate(request) {
    const schema = {
        email: Joi.string().min(5).max(100).required().email(),
        password: Joi.string().min(5).max(100).required()                           
    };
  
    return Joi.validate(request, schema);                                 
}


module.exports = router;