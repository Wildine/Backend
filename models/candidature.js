const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Candidature = sequelize.define('Candidature', {
    id: { 
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },

    offre_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'offres',
            key: 'id'
        }
    },

    statut: {
        type: DataTypes.ENUM('en_attente', 'accepte', 'rejete'),
        defaultValue: 'en_attente'
    },      

    date_candidature: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
}, 
{
    tableName: 'candidatures',
    timestamps: true,
});

module.exports = Candidature;
