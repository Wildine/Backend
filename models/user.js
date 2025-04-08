const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false
    },

    role: {
        type: DataTypes.ENUM('etudiant', 'entreprise', 'encadrant', 'demandeur_emploi'),
        allowNull: false
    },
    
},
{
    tableName: 'users',
    timestamps: true
});

module.exports = User;