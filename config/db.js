const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('backend', 'wildine', 'wildine',{
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

// Verification lors de la connexion
sequelize.authenticate()
.then(()=> console.log('Connecte a MySQL avec Sequelize'))
.catch(err => console.error('Erreur lors de la connexion:', err));

module.exports = sequelize;