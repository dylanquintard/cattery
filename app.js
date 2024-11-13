const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const catsRoutes  = require('./routes/cats')
const path = require('path');

mongoose.connect(process.env.MONGODB_URI)  // Utiliser la variable d'environnement
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((error) => console.log('Connexion à MongoDB échouée !', error));

const app = express();

// Utilisation du middleware CORS
app.use(cors());

// Utilisation de body-parser pour parser les requêtes JSON
app.use(bodyParser.json());

// Si vous avez des routes statiques (comme des fichiers), vous pouvez les ajouter ici
app.use('/files', express.static(path.join(__dirname, 'files')));

// Routes pour l'API
app.use('/api/cats', catsRoutes);

// Ne pas avoir besoin de définir manuellement les en-têtes CORS ici, car `cors()` s'en charge
module.exports = app;
