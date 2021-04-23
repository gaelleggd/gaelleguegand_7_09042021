
// Actions liées aux utilisateurs

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require("../models");
const CryptoJS = require('crypto-js');
const fs = require('fs');

// Nouvelle inscription
exports.signup = (req, res) => {
  const email = req.body.email;
  const firstname = req.body.firstname;
  const name = req.body.name;
  const password = req.body.password;
  const regexEmail = /^[a-z0-9._-]+@[a-z0-9.-]{2,}[.][a-z]{2,3}$/; // Caractères imposés pour le mail et mdp
  const regexPassword = /((?=.*[a-z])(?=.*[A-Z]).{6,})/;

  if (email === null || email === '' || // Rendre tours les champs obligatoires
    firstname === null || firstname === '' ||
    name === null || name === '' ||
    password === null || password === '') {
    return res.status(400).json({ error: 'Tous les champs sont obligatoires' });
  }

  if (regexEmail.test(email) === false) { return res.status(400).json({ error: 'L\'email est invalide' }); }
  if (regexPassword.test(password) === false) { return res.status(400).json({ error: 'Le mot de passe doit contenir entre 6 et 10 caratères et au moins une majuscule et une minuscule' }); }

  bcrypt.hash(req.body.password, 10) // Sécurisation du mdp
    .then(hash => {
      const newUser = {
        firstname: req.body.firstname,
        name: req.body.name.toUpperCase(),
        email: CryptoJS.MD5(req.body.email).toString(), // Sécurisation du mail
        password: hash
      }
      User.create(newUser)
        .then(() => res.status(200).json({ message: 'Utilisateur crée !' }))
        .catch(() => res.status(400).json({ error: "Cet email est déjà utilisé" }))
    })
    .catch(error => res.status(500).json({ error }));
};

// Connexion
exports.login = (req, res) => {
  let cryptedMail = CryptoJS.MD5(req.body.email).toString(); // Cryptage de l'email 
  User.findOne({ where: { email: cryptedMail } })// Recherche de l'email dans la BDD
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      
      bcrypt.compare(req.body.password, user.dataValues.password) // comparaison des mdp
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect ! " });
          }
          res.status(200).json({ // Ajout du token 
            userId: user.dataValues.id,
            token: jwt.sign(
              { userId: user.dataValues.id },
              process.env.SECRET_TOKEN,
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

// Récupérer un utilisateur
exports.getOneUser = (req, res) => {
  User.scope('nopassword').findOne({ where: { id: req.body.id } })
    .then(user => res.status(200).json(user))
    .catch(error => res.status(500).json({ error }))
}

// Modification du mdp
exports.changePassword = (req, res) => {
  User.findOne({ where: { id: req.body.id } })
    .then(user => {
      bcrypt.compare(req.body.oldPassword, user.dataValues.password) // Comparaison des mdp
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: "Le mot de passe actuel est incorrect" })
          }
          bcrypt.hash(req.body.newPassword, 10) // Sécurisation du nouveau mdp
            .then(newHash => {
              User.update({ password: newHash }, { where: { id: req.body.id } }) // Maj de la bdd
              res.status(201).json({ message: "Mot de passe changé avec succès" })
            })
            .catch(error => {
              res.status(500).json({ error });
            })
        })
        .catch(error => res.status(500).json({ error }))
    })
    .catch(() => res.status(400).json({ error: "Utilisateur inconnu !" }))
}

// Modification de la photo de l'utilisateur
exports.changeAvatar = (req, res) => {
  User.findOne({
    where: {
      id: req.body.userId
    }
  })
    .then(user => { // Suppression de l'ancienne image
      const filename = user.avatar_url.split('/images/')[1];
      if (filename != "default_picture.jpg") {
        fs.unlink(`images/${filename}`, (err) => {
          if (err) {
            console.log("Erreur lors de la suppression de l'image: " + err);
          }
        });
      }
      const newAvatar = { // Ajout de la nouvelle image
        avatar_url: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      }
      User.update(newAvatar, { // Maj de la bdd
        where: {
          id: req.body.userId
        }
      })
        .then(() => res.status(201).json({ message: "Avatar changé" }))
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
}

// Suppression d'un utilisateur
exports.deleteUser = (req, res) => {
  User.findOne({
    where: {
      id: req.params.id
    }
  })
    .then(user => { // Suppression de l'image 
      const filename = user.avatar_url.split('/images/')[1];
      if (filename != "default_picture.jpg") {
        fs.unlink(`images/${filename}`, (err) => {
          if (err) {
            console.log("Erreur lors de la suppression de l'image: " + err);
          }
        });
      }
      User.destroy({ where: { id: req.params.id } }) // Suppression de l'utilisateur
        .then(() => res.status(200).json({ message: "Utilisateur supprimé" }))
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
}