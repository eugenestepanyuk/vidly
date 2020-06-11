//const winston = require('winston');

module.exports = function(err, request, response, next) {
    //winston.error(err.message, err);

    response.status(500).send('Something failed');
}