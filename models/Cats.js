const mongoose = require('mongoose');

const catSchema = mongoose.Schema({
  titre: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String, required: true }],  // Array of image URLs
  categorie: { type: String, required: true },
});

module.exports = mongoose.model('Cat', catSchema);