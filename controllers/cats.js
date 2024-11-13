const sharp = require('sharp');
const Cats = require('../models/Cats');  // Ensure the path is correct

exports.createCat = async (req, res, next) => {
  try {
    if (!req.body.cat) {
      throw new Error("Cat data is missing.");
    }
    const catObject = JSON.parse(req.body.cat);
    delete catObject._id;

    // Use Sharp for compression and conversion to webp
    const { buffer } = req.file;
    const timestamp = Date.now();
    const fileName = `${timestamp}.webp`;
    const outputPath = `./files/${fileName}`;

    await sharp(buffer)
      .webp({ quality: 20 })
      .toFile(outputPath);

    const newCat = new Cats(catObject);
    newCat.image = `/files/${fileName}`;

    await newCat.save();

    res.status(201).json({ message: 'Cat saved!' });
  } catch (error) {
    console.error(error.message);
    console.error(req.body);
    console.error(req.file);
    res.status(400).json({ error: 'Error while creating the cat' });
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