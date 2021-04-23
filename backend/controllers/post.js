// Actions liées aux posts //

const { Post, User, Like, Comment } = require("../models");
const { Op } = require("sequelize");
const fs = require('fs');

exports.getPosts = (req, res) => { // Récupère tous les posts avec les utilisateurs correspondants
  Post.scope('formatted_date').findAll({
    include: [{ model: User, as: 'User', attributes: ['firstname', 'name', 'avatar_url'] },
    { model: Like },  // Récupère les likes 
    {
      model: Comment, // Récupère les commentaires
      include: [{ model: User, attributes: ['firstname', 'name', 'avatar_url'] }],
    }
    ],
    order: [ // // Classement du plus récent au plus ancien
      ['date_publication', 'DESC'],
      [Comment, 'createdAt', 'DESC']
    ]
  })
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(error => {
      res.status(500).json({ error });
    });
}

// Création d'un post
exports.createPost = (req, res) => {
  const newPost = {
    img_url: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    UserId: req.body.userId
  };
  Post.create(newPost)
  
    .then(post => res.status(201).json(post))
    .catch(error => res.status(500).json({ error }));
}


// Suppression d'un post
exports.deletePost = (req, res) => {
  Post.findOne({ where: { id: req.params.id } })
    .then(post => {
      const filename = post.img_url.split('/images/')[1]; // Suppression de l'image du post  
      fs.unlink(`images/${filename}`, () => {
        Post.destroy({ where: { id: req.params.id } }) // Suppression du post
          .then(() => res.status(200).json({ message: 'Post supprimé !' }))
          .catch(error => res.status(500).json({ error }));
      })
    })
    .catch(error => res.status(500).json({ error }));
}

// Ajout et retrait des likes
exports.likePost = (req, res) => {
  Like.findOne({
    where: {
      userId: req.body.userId,
      postId: req.body.postId
    }
  })
    .then(response => { // L'utilisateur n'a pas encoré liké ou disliké
      if (response == null) {
        // Ajout du like
        if (req.body.likeValue == 1) {
          Like.create({ liked: req.body.likeValue, postId: req.body.postId, userId: req.body.userId });
          Post.increment({ likes: 1 }, { where: { id: req.body.postId } })
          res.status(201).json({ message: 'Like ajouté au post' })
        }
        // ajout du dislike
        else if (req.body.likeValue == -1) {
          Like.create({ liked: req.body.likeValue, postId: req.body.postId, userId: req.body.userId });
          Post.increment({ dislikes: 1 }, { where: { id: req.body.postId } })
          res.status(201).json({ message: 'Dislike ajouté au post' })
        }
      }
      else if (response.dataValues.liked == 1) { // L'utilsateur a déjà liké le post
        if (req.body.likeValue == -1) { // Au clic sur le dislike
          Like.update({ liked: -1 }, {
            where: {
              [Op.and]: [{ postId: req.body.postId }, { userId: req.body.userId }]
            }
          })
          Post.increment({ dislikes: 1 }, { where: { id: req.body.postId } }); // ajout du dislike
          Post.decrement({ likes: 1 }, { where: { id: req.body.postId } }); // retrait du like
          res.status(201).json({ message: 'Like retiré et dislike ajouté au post' })
        }
        else { // Au clic sur le like
          Like.destroy({
            where: {
              [Op.and]: [{ postId: req.body.postId }, { userId: req.body.userId }]
            }
          });
          Post.decrement({ likes: 1 }, { where: { id: req.body.postId } }); // retrait du like
          res.status(201).json({ message: 'Like retiré du post' })
        }
      }
      else if (response.dataValues.liked == -1) { // L'utilisateur a déjà disliké le post
        if (req.body.likeValue == 1) { // Au clic sur le like
          Like.update({ liked: 1 }, {
            where: {
              [Op.and]: [{ postId: req.body.postId }, { userId: req.body.userId }]
            }
          })
          Post.decrement({ dislikes: 1 }, { where: { id: req.body.postId } }); // Ajout du like
          Post.increment({ likes: 1 }, { where: { id: req.body.postId } }); // Retrait du dislike
          res.status(201).json({ message: 'Dislike retiré et like ajouté au post' })
        }
        else { // Au clic sur le dislike
          Like.destroy({
            where: {
              [Op.and]: [{ postId: req.body.postId }, { userId: req.body.userId }]
            }
          });
          Post.decrement({ dislikes: 1 }, { where: { id: req.body.postId } }); // Retrait du dislike
          res.status(201).json({ message: 'Dislike retiré du post' })
        }
      }
    })
    .catch(error => res.status(500).json({ error }));
}