const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const catsRoutes  = require('./routes/cats')
const path = require('path');

mongoose.connect('mongodb+srv://eazybang1331:olxAk6oOfb3ESzCA@cattery.2rmjy.mongodb.net/?retryWrites=true&w=majority',
    )
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use('/api/cats', catsRoutes);
app.use('/files', express.static(path.join(__dirname, 'files')));


module.exports = app;
