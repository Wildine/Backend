const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Entretien = sequelize.define('Entretien', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    date_entretien: {
        type: DataTypes.DATE,
        allowNull: false
    },

    statut: {
        type: DataTypes.ENUM('prevu', 'realise', 'annule'),
        allowNull: false,
        defaultValue: 'prevu'
    },

    candidature_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'candidatures',
            key: 'id'
        }
    }
}, 
{
    tableName: 'entretiens',
    timestamps: true
});

module.exports = Entretien;