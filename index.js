const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const errorHandler = require('errorhandler');
const cors = require('cors');
const mongoose = require('mongoose');
const pino = require('express-pino-logger')(); //logger
const { handleError } = require('./config/errorHandler');
const admin = require('firebase-admin');
const { firebaseConfig } = require('./shared-config/firebaseConfig')

//Configure isProduction variable
const isProduction = process.env.NODE_ENV && process.env.NODE_ENV === 'production';

if(!isProduction) {
  //Configs and imports
  require('dotenv').config();
}

//Configs
require('./config/dbClient');
require('./models/subscriptionModel');
require('./models/bundleSubscriptionModel');

const indexRouter = require('./api');

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors())
app.use(pino);
app.use(express.static(path.join(__dirname, '__sapper__')));

app.use('/api/', indexRouter);

if(!isProduction) {
  app.use(errorHandler());
}

admin.initializeApp(firebaseConfig);

app.use((err, req, res, next) => {
  handleError(err, res);
})

const port = process.env.PORT || 3001;
app.listen(port, () =>
  console.log('Express server is running on ' + port)
);
