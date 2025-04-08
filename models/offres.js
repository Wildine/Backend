const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Offre = sequelize.define('Offre', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    titre: {
        type: DataTypes.STRING,
        allowNull: false
    },

    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    date_publication: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    },

    date_expiration: {
        type: DataTypes.DATE,
        allowNull: false
    },

    statut: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active'
    },

    type_offre: {
        type: DataTypes.ENUM('stage', 'emploi'),
        allowNull: false
    },

    entreprise_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'entreprises',
            key: 'id'
        }
    }
}, 
{
    tableName: 'offres',
    timestamps: true
});

module.exports = Offre;