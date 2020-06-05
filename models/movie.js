const Joi = require('joi');
const mongoose = require('mongoose');
const { genreSchema } = require('./genre');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 100
    },
    genre: {
        type: genreSchema,
        //type: mongoose.Schema.Types.ObjectId,
        //ref: 'Genre',
        required: true,
        validate: {  
            validator: (v) => Promise.resolve(v && v.length > 0),           
            message: 'A movie should have at least one genre.'              
        }
    },
    numberInStock: { 
        type: Number, 
        required: true,
        min: 0,
        max: 255
      },
    dailyRentalRate: { 
        type: Number, 
        required: true,
        min: 0,
        max: 255
    }
});

const Movie = mongoose.model('Movie', movieSchema);

function validateMovie(movie) {
    const schema = {
        title: Joi.string().min(5).max(50).required(),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0).required()                            
    };
  
    return Joi.validate(movie, schema);                                 
}

exports.Movie = Movie;
exports.validate = validateMovie;