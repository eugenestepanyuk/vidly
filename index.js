const express = require('express');
const Joi = require('joi');
const config = require('config');
Joi.objectId = require('joi-objectid')(Joi);
const genres = require('./routes/genres');                                 
const movies = require('./routes/movies');  
const rentals = require('./routes/rentals');                    
const home = require('./routes/home');
const users = require('./routes/users');  
const auth = require('./routes/auth');
const customers = require('./routes/customers');                         
const mongoose = require('mongoose');

const app = express();

// export vidly_jwtPrivateKey=mySecureKey
if(!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwtPrivateKey is not defined.');
    process.exit(1);
}

mongoose.connect('mongodb://localhost/vidly-cinema', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDb..'))
    .catch(err => console.error('Could not connect to MongoDB..', err));
mongoose.set('useCreateIndex', true);

const port = process.env.PORT || 3000;

app.use(express.json()); 
app.use('/api/genres', genres);                                   
app.use('/api/movies', movies);  
app.use('/api/customers', customers);     
app.use('/api/rentals', rentals); 
app.use('/api/users', users);   
app.use('/api/auth', auth);                         
app.use('/', home);                                         

app.listen(port, () => console.log(`Server listening on ${port} port...`));

