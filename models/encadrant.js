const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Encadrant = sequelize.define('Encadrant', {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    
    prenom: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },

    nom: { 
        type: DataTypes.STRING, 
        allowNull: false 
    }
},
{
    tableName: 'encadrants',
    timestamps: true
});

module.exports = Encadrant;
