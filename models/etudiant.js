const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Etudiant = sequelize.define('Etudiant', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    prenom: {
        type: DataTypes.STRING,
        allowNull: false
    },

    nom: {
        type: DataTypes.STRING,
        allowNull: false
    },

    universite: {
        type: DataTypes.STRING,
        allowNull: false
    }
},
{
    tableName: 'etudiants',
    timestamps: true
});

module.exports = Etudiant;