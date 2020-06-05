const express = require('express');
const mongoose = require('mongoose');
const { Rental, validate } = require('../models/rental'); 
const { Movie } = require('../models/movie'); 
const { Customer } = require('../models/customer'); 
const Fawn = require('fawn');

const router = express.Router();
Fawn.init(mongoose);

router.get('/', async (request, response) => {
  const rentals = await Rental.find().sort('-dateOut');
  response.send(rentals);
});

router.get('/:id', async (request, response) => {
  const rental = await Rental.findById(request.params.id);
  if (!rental) return response.status(404).send('The rental with the given ID was not found.');

  response.send(rental);
});

router.post('/', async (request, response) => {
  const { error } = validate(request.body); 
  if (error) return response.status(400).send(error.details[0].message);

  const customer = await Customer.findById(request.body.customerId);
  if (!customer) return response.status(400).send('Invalid customer.');

  const movie = await Movie.findById(request.body.movieId);
  if (!movie) return response.status(400).send('Invalid movie.');

  if (movie.numberInStock === 0) return response.status(400).send('Movie not in stock.');

  let rental = new Rental({ 
    customer: {
      _id: customer._id,
      name: customer.name, 
      phone: customer.phone
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
  });
  // rental = await rental.save();

  // movie.numberInStock--;
  // movie.save();

  try {
    new Fawn.Task()
    .save('rentals', rental)
    .update('movies', { _id: movie._id }, {
      $inc: { numberInStock: -1 }
    })
    .run(); 
  } 
  catch(ex) {
    response.status(500).send('Something failed');
  }
  
  
  response.send(rental);
});


module.exports = router; 