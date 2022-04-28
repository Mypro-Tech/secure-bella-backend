/* eslint-disable no-console */
require('dotenv').config({ path: './.env.development' });
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const { createServer } = require('http');

const { authLimiter } = require('./middlewares/rateLimiter');

const errorHandler = require('./middlewares/Error');
const apiRouter = require('./routes');

/* ***********************************************
* ********* END OF FILE IMPORTS *****************
/* ***********************************************
*/

const app = express();
const httpServer = createServer(app);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// middlewares
app.use(cors());
app.options('*', cors());

app.use(helmet());

app.use(xss());
app.use(mongoSanitize());

app.use(compression());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static/', express.static(path.join('static/')));
if (process.env.NODE_ENV === 'development') app.use(require('morgan')('dev'));

if (process.env.NODE_ENV === 'production') app.use('/api/v1', authLimiter);

// mount routes
app.use('/api/v1', apiRouter);
app.use('/hello-world', (_, res) => res.sendFile(`${__dirname}/static/hello-world.html`));

app.all('/*', (req, res) => {
  res.status(404).json({ success: false, message: 'invalid url' });
});

app.use(errorHandler);

mongoose.connection
  .once('open', async () => {
    console.log('🎉 connected to database');

    httpServer.listen(process.env.PORT || 5000, (err) => {
      if (err) console.log(err);
      else console.log(`server running on port ${process.env.PORT || 5000}`);
    });
  })
  .on('error', (err) => console.log('😢 connection to database failed!', err));

const exitHandler = () => {
  if (httpServer) {
    httpServer.close(() => {
      console.log('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  console.log(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  console.log('SIGTERM received');
  if (httpServer) {
    httpServer.close();
  }
});
