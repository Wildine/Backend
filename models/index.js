const User = require('./user');
const Etudiant = require('./etudiant');
const Entreprise = require('./entreprise');
const Encadrant = require('./encadrant');
const DemandeEmploi = require('./demandeEmploi');
const Candidature = require('./candidature');
const Offre = require('./offres');
const Entretien = require('./entretien');
const Evaluation = require('./evaluation');
const Document = require('./document');


Etudiant.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });

Entreprise.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
User.hasOne(Entreprise, { foreignKey: 'user_id' });

Encadrant.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
User.hasOne(Encadrant, { foreignKey: 'user_id' });

DemandeEmploi.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
User.hasOne(DemandeEmploi, { foreignKey: 'user_id' });

// // Relation entre Entreprise et Offre
Entreprise.hasMany(Offre, { foreignKey: 'entreprise_id', onDelete: 'CASCADE' });
Offre.belongsTo(Entreprise, { foreignKey: 'entreprise_id' });

// Un utilisateur peut avoir plusieurs candidatures
User.hasMany(Candidature, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Candidature.belongsTo(User, { foreignKey: 'user_id' });

// Une offre peut recevoir plusieurs candidatures
Offre.hasMany(Candidature, { foreignKey: 'offre_id', onDelete: 'CASCADE' });
Candidature.belongsTo(Offre, { foreignKey: 'offre_id' });

Candidature.hasOne(Entretien, { foreignKey: 'candidature_id', onDelete: 'CASCADE' });
Entretien.belongsTo(Candidature, { foreignKey: 'candidature_id' });

User.hasMany(Evaluation, { foreignKey: 'stagiaire_id' });
Evaluation.belongsTo(User, { as: 'stagiaire', foreignKey: 'stagiaire_id' });

User.hasMany(Evaluation, { foreignKey: 'encadrant_id' });
Evaluation.belongsTo(User, { as: 'encadrant', foreignKey: 'encadrant_id' });


module.exports = { User, Etudiant, Entreprise, Encadrant, DemandeEmploi, Candidature, Offre, Entreprise, Entretien, Evaluation, Document };
