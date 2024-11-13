const mongoose = require('mongoose');

const catsSchema = mongoose.Schema({
    titre: { type: String, required: true },
    image: { type: String },
    description: { type: String, required: true },
});

module.exports = mongoose.model('Cats', catsSchema);