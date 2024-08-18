const { Model, Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config');

class User extends Model {}

User.init({
    // Model attributes are defined here
    id: {
        type: DataTypes.STRING,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        unique: true
    },
	email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull: {
              msg: 'Please enter your email',
            },
            notEmpty: {
                msg: 'Please enter your email'
            }
        }
    }, // must be unique and must not be null
	password : {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
              msg: 'Please enter your password',
            },
            notEmpty: {
                msg: 'Please enter your password'
            }
        }
    }, // must not be null
  },
  {
    sequelize,// Other model options go here
    modelName: 'User', 
    timestamps: false,
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    }
  }
);


class Todo extends Model {}
Todo.init(
    {
      id: {
        type: DataTypes.STRING,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        unique: true
      },
      description: {
        type: DataTypes.STRING
      }
    }, {
        sequelize,
        modelName: 'Todo',
        timestamps: true
    }
);

// `sequelize.define` also returns the model
console.log(User === sequelize.models.User); // true
module.exports = { User, Todo };