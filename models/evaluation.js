const { DataTypes } = require('sequelize');
const sequilize = require('../config/db');

const Evaluation = sequilize.define('Evaluation', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    stagiaire_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "users",
            key: "id",
        },
    },
    
    encadrant_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "users",
            key: "id",
        },
    },

    note: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },

    commentaire: {
        type: DataTypes.TEXT,
    },

    date_evaluation: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, 
{
    tableName: "evaluations",
    timestamps: true,
});

module.exports = Evaluation;