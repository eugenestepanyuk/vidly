const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User, validate } = require('../models/user');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/me', auth, async (request, response) => {
    const user = await User.findById(request.user._id).select('-password');
    response.send(user);
});

router.post('/', async (request, response) => {
    const { error } = validate(request.body); 
    if (error) return response.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: request.body.email });
    if (user) return response.status(400).send('User already registered');

    // user = new User({
    //     name: request.body.name,
    //     email: request.body.email,
    //     password: request.body.password
    // });
    user = new User(_.pick(request.body, ['name', 'email', 'password']));               // pick выбирает свойства обьекта
    const salt = await bcrypt.genSalt(10);                                              // добавление рандомной строки к паролю
    user.password = await bcrypt.hash(user.password, salt);                             // хеширование пароля

    await user.save();

    // response.send({
    //     name: user.name,
    //     email: user.email
    // });
    const token = user.generateAuthToken(); 

    response.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});


module.exports = router;