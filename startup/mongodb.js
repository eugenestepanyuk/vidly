const mongoose = require('mongoose');
const { createLogger, format, transports } = require('winston');

const logger = createLogger({
    format: format.combine(
      format.splat(),
      format.simple()
    ),
    transports: [new transports.Console()]
  });

module.exports = () => {
    mongoose.connect('mongodb://localhost/vidly-cinema', { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => logger.log('info', 'Connected to MongoDb..'));
    mongoose.set('useCreateIndex', true);
}