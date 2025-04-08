const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Document = sequelize.define('Document', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    titre: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    type: {
        type: DataTypes.ENUM(
            'attestation',
            'rapport_evaluation',
            'lettre_acceptation',
            'convention_stage',
            'accord_confidentialite',
            'contrat_chercheur_emploi'
        ),
        allowNull: false,
    },

    fichier: { // Chemin du fichier sur le serveur ou sur un service de stockage
        type: DataTypes.STRING,
        allowNull: false,
    },

    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },

    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'documents',
    timestamps: true,
});

module.exports = Document;
