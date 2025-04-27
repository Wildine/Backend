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

    heure_entretien: {
        type: DataTypes.TIME,
        allowNull: false
    },

    mode: {
        type: DataTypes.ENUM('presentiel', 'visio', 'telephone'),
        allowNull: false
    },

    lien_ou_lieu: {
        type: DataTypes.STRING,
        allowNull: false
    },

    message: {
        type: DataTypes.TEXT,
        allowNull: true
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