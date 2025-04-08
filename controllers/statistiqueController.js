const { Offre, Candidature, Entretien, Evaluation, User } = require('../models');

// Récupérer les statistiques globales
exports.getGlobalStats = async (req, res) => {
    try {
        const stats = {
            total_users: await User.count(),
            total_etudiants: await User.count({ where: { role: 'etudiant' } }),
            total_entreprises: await User.count({ where: { role: 'entreprise' } }),
            total_encadrants: await User.count({ where: { role: 'encadrant' } }),
            total_offres: await Offre.count(),
            total_candidatures: await Candidature.count(),
            total_entretiens: await Entretien.count(),
            total_evaluations: await Evaluation.count(),
        };

        res.status(200).json({ message: 'Statistiques globales récupérées', stats });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération des statistiques' });
    }
};
