const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const DemandeEmploi = sequelize.define('DemandeEmploi', {
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
    tableName: 'demande_emploi',
    timestamps: true
});

module.exports = DemandeEmploi;
