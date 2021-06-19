const bcrypt = require('bcrypt')
const sequelize = require('../config/connection')
const { Model, DataTypes } = require('sequelize')

class User extends Model {
    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.password);
    }
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        platform: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [8],
            },
        },
    },
    {
        hooks: {
            beforeCreate: async (newUserData) => {
                newUserData.password = await bcrypt.hash(newUserData.password, 8);
                return newUserData
            },
            beforeUpdate: async (updatedUserData) => {
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 8);
                return updatedUserData;
            },
            beforeBulkCreate: async (users) => {
                for (const user of users) {
                    user.password = await bcrypt.hash(user.password, 8);
                }
                
            }
        },
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true, 
        modelName: 'user'
    }
);

module.exports = User;