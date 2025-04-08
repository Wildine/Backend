const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Entreprise = sequelize.define('Entreprise', {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true
    },

    nom_entreprise: { 
        type: DataTypes.STRING, 
        allowNull: false 
    }
},
{
    tableName: 'entreprises',
    timestamps: true
});

module.exports = Entreprise;
