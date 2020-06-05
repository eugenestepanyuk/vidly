const express = require('express');
const router = express.Router();

router.get('/', (request, response) => {
    response.send('<h1>Welcome to Vidly!</h1>');
});

module.exports = router;