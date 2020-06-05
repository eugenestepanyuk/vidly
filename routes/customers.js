const express = require('express');
const { Customer, validate } = require('../models/customer');

const router = express.Router();


router.get('/', async (request, response) => {
    const customer = await Customer.find().sort('name');                               
    response.send(customer);
});

router.get('/:id', async (request, response) => {
    const customer = await Customer.findById(request.params.id);
    if (!customer) return response.status(404).send('The customer was not found..');

    response.send(customer);
  });
  
router.post('/', async (request, response) => {
    const { error } = validate(request.body); 
    if (error) return res.status(400).send(error.details[0].message);

    let newCustomer = new Customer({
        name: request.body.name,
        isGold: request.body.isGold,
        phone: request.body.phone     
    });
    newCustomer = await newCustomer.save();

    response.send(newCustomer);
});

router.put('/:id', async (request, response) => {
    const { error } = validate(request.body);
    if (error) return response.status(400).send(error.details[0].message);

    const customer = await Customer.findByIdAndUpdate(request.params.id, { 
        name: request.body.name,
        isGold: request.body.isGold,
        phone: request.body.phone  
     }, { new: true });
    if (!customer) return response.status(404).send('The customer was not found..');

    response.send(customer);
});

router.delete('/:id', async (request, response) => {
    const customer = await Customer.findByIdAndRemove(request.params.id);
    if (!customer) return response.status(404).send('The customer was not found..');
    
    response.send(customer);
});


module.exports = router;