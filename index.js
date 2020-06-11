const { createLogger, format, transports } = require('winston');
const express = require('express');
const app = express();

//require('./startup/logging');
require('./startup/routers')(app);
require('./startup/mongodb')();
require('./startup/config')();
require('./startup/validation');

const logger = createLogger({
  format: format.combine(
    format.splat(),
    format.simple()
  ),
  transports: [new transports.Console()]
});

const port = process.env.PORT || 3000;
//app.listen(port, () => console.log(`Server listening on ${port} port...`));
app.listen(port, () => logger.log('info', `Server listening on ${port} port...`));

