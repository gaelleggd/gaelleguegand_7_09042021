module.exports = (sequelize, DataTypes) => {
    const Like = sequelize.define('Like', {
      liked: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      postId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Post',
          key: 'id'
        }
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'User',
          key: 'id'
        }
      }
    },
      {
        timestamps: false,
        tableName: 'likes'
      }
    );
  
    Like.associate = function (models) { 
      models.User.belongsToMany(models.Post, { // Lien entre un utilisateur et un post à travers le like
        through: models.Like,
        foreignKey: 'userId',
        otherKey: 'postId',
      });
  
      models.Post.belongsToMany(models.User, { // Lien entre un post et un utilisateur à travers le like
        through: models.Like,
        foreignKey: 'postId',
        otherKey: 'userId',
      });
  
      models.Like.belongsTo(models.User, { // Lien entre un like et un utilisateur
        foreignKey: 'userId',
        as: 'user',
      });
  
      models.Like.belongsTo(models.Post, { // Lien entre un like et un post
        foreignKey: 'postId',
        as: 'post',
      });
    };

    
  
    return Like;
  }