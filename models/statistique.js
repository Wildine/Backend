const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Statistique = sequelize.define("Statistique", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement:true
    }

    
})