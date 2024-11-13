const sharp = require('sharp');
const Cats = require('../models/Cats');

exports.createCat = async (req, res, next) => {
  try {
    // Vérifier que les champs requis sont présents
    const { titre, description } = req.body;
    if (!titre || !description) {
      console.error("Missing title or description.");
      throw new Error("Missing title or description.");
    }

    const catObject = { titre, description };

    let imageUrl = '';  // Par défaut, pas d'image

    // Si un fichier est présent, traiter l'image
    if (req.file) {
      console.log("Image received, processing...");
      const { buffer } = req.file;
      const timestamp = Date.now();
      const fileName = `${timestamp}.webp`;
      const outputPath = `./files/${fileName}`;

      await sharp(buffer)
        .webp({ quality: 20 })
        .toFile(outputPath);

      imageUrl = `/files/${fileName}`;
    } else {
      console.log("No image provided.");
    }

    const newCat = new Cats({ ...catObject, image: imageUrl });

    await newCat.save();

    res.status(201).json({ message: 'Cat saved!' });
  } catch (error) {
    console.error("Error:", error.message);
    console.error("Request Body:", req.body);
    console.error("Uploaded File:", req.file);
    res.status(400).json({ error: error.message });
  }
};

exports.getAllCats = (req, res, next) => {
  Cats.find().then(
    (cats) => {
      res.status(200).json(cats);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.getOneCat = (req, res, next) => {
  Cats.findOne({
    _id: req.params.id
  }).then(
    (cat) => {
      res.status(200).json(cat);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modifyCat = async (req, res, next) => {
  try {
    console.log(req.file);
    const catObject = req.file ? {
      ...JSON.parse(req.body.cat),
      image: `${req.protocol}://${req.get('host')}/files/${req.file.filename}`
    } : { ...req.body };

    if (req.file) {
      // Use Sharp for compression and conversion to webp
      const { buffer } = req.file;
      const timestamp = Date.now();
      const fileName = `${timestamp}.webp`;
      const outputPath = `./files/${fileName}`;

      await sharp(buffer)
        .webp({ quality: 20 })
        .toFile(outputPath);

      // Update image URL with the new webp file
      catObject.image = `/files/${fileName}`;
    }

    await Cats.updateOne({ _id: req.params.id }, { ...catObject, _id: req.params.id });
    res.status(200).json({ message: 'Object modified!' });
  } catch (error) {
    res.status(500).json({ error: 'Error while modifying the cat' });
  }
};

exports.deleteCat = (req, res, next) => {
  Cats.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Cat deleted!' }))
    .catch(error => res.status(400).json({ error }));
};