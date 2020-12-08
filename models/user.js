'use strict';
/*const {
  Model
} = require('sequelize');*/
module.exports = (sequelize, DataTypes) => {
/*  class User extends Model {*/
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
/*    static associate(models) {
      // define association here
    }
  };
  User.init({*/
  const User = sequelize.define("User",{
    name: {
      type:DataTypes.STRING,
      validate:{
        notEmpty:true
      }
    },
    pass: {
      type:DataTypes.STRING,
      validate:{
        notEmpty:true
      }
    },
    mail: {
      type:DataTypes.STRING,
      validate:{
        isEmail:true
      }
    },
    age: {
      type:DataTypes.INTEGER,
      validate:{
        isInt:true,
        min:0,
      }
    }
  }, {});
/*    sequelize,
    modelName: 'User',
  });*/
  User.associate = function(models){

  };
  return User;
};