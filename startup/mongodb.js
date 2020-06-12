const mongoose = require('mongoose');
const { createLogger, format, transports } = require('winston');
const config = require('config');

console.log(`[${process.env.NODE_ENV.toUpperCase()}]: Loaded configuration`, config);

const logger = createLogger({
    format: format.combine(
      format.splat(),
      format.simple()
    ),
    transports: [new transports.Console()]
  });

module.exports = () => {
    mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => logger.log('info', 'Connected to MongoDb..'));
    mongoose.set('useCreateIndex', true);
}