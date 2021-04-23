module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      img_url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      date_publication: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
      },
      likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
      },
      dislikes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
      }
    },
      {
        timestamps: false,
        tableName: 'posts'
      }
    );
    Post.associate = function (models) { // Lien entre un post et un utilisateur
      models.Post.belongsTo(models.User, {
        onDelete: "cascade",
        foreignerKey: {
          name: 'UserId',
          allowNull: false
        }
      });
      models.Post.hasMany(models.Like, { // Lien entre un post et un like
        foreignKey: 'postId',
      })
      models.Post.hasMany(models.Comment, { // Lien entre un post et un commentaire
        foreignKey: 'postId',
      })
    };
  
    Post.addScope('formatted_date', { // Définition de la requête de la date
      attributes: {
        include: [[sequelize.fn('date_format', sequelize.col('date_publication'), '%Y-%m-%d %H:%i'), 'formatted_date']]
      }
    });
  
    return Post;
  }