const Cats = require('../models/Cats');

exports.createCat = async (req, res, next) => {
  try {
    // Extraire les champs du formulaire, y compris la catégorie
    const { titre, description, imageUrls, categorie } = req.body; // Maintenant on prend aussi 'imageUrls' en entrée

    // Vérifier que la catégorie est valide
    const validCategories = ['mâles', 'femelles', 'chatons', 'nés chez nous', 'retraités'];
    if (!validCategories.includes(categorie)) {
      return res.status(400).json({ error: "Catégorie invalide" });
    }

    // Créer une nouvelle instance du modèle Cats avec les URL des images et la catégorie
    const newCat = new Cats({
      titre,
      description,
      images: imageUrls,  // Enregistre un tableau d'URLs d'images
      categorie,         // Enregistre la catégorie
    });

    // Enregistrer l'instance dans la base de données
    const savedCat = await newCat.save();

    // Répondre avec succès
    res.status(201).json({ message: "Chat ajouté avec succès !", newCat: savedCat });
  } catch (error) {
    // Gérer les erreurs
    console.error(error);
    res.status(400).json({ error: "Erreur lors de l'ajout du chat" });
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
    // Extraire les champs de la requête
    const { titre, description, images, categorie } = req.body; // Utiliser "images" au lieu de "imageUrl"

    // Vérifier que la catégorie est valide
    const validCategories = ['mâles', 'femelles', 'chatons', 'nés chez nous', 'retraités'];
    if (!validCategories.includes(categorie)) {
      return res.status(400).json({ error: "Catégorie invalide" });
    }

    // Créer l'objet de modification, en incluant les URLs des images
    const updatedCat = {
      titre,
      description,
      images,  // Utiliser le tableau d'URLs d'images
      categorie,
    };

    // Mettre à jour le chat dans la base de données
    await Cats.updateOne({ _id: req.params.id }, updatedCat);
    res.status(200).json({ message: 'Chat modifié avec succès !' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la modification du chat' });
  }
};

exports.deleteCat = (req, res, next) => {
  Cats.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Cat deleted!' }))
    .catch(error => res.status(400).json({ error }));
};