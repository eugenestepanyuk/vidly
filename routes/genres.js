const express = require('express');
const { Genre, validate } = require('../models/genre');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();


router.get('/', auth, async (request, response) => {
  const genres = await Genre.find().sort('name');
  response.send(genres);
});

router.get('/:id', auth, async (request, response) => {
  const genre = await Genre.findById(request.params.id);
  if (!genre) return response.status(404).send('The genre was not found.');

  response.send(genre);
});

router.post('/', auth, async (request, response) => {
  const { error } = validate(request.body); 
  if (error) return response.status(400).send(error.details[0].message);

  let genre = new Genre({ name: request.body.name });
  genre = await genre.save();
  
  response.send(genre);
});

router.put('/:id', auth, async (request, response) => {
  const { error } = validate(request.body); 
  if (error) return response.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(request.params.id, { 
    name: request.body.name 
  }, { new: true });
  if (!genre) return response.status(404).send('The genre was not found.');
  
  response.send(genre);
});

router.delete('/:id', [auth, admin], async (request, response) => {
  const genre = await Genre.findByIdAndRemove(request.params.id);
  if (!genre) return response.status(404).send('The genre was not found.');

  response.send(genre);
});


module.exports = router;