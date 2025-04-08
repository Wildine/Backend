const { Offre, Candidature, Entretien, Evaluation, User } = require('../models');

exports.getDashboard = async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouve' });
        }

        let data = {};

        if (user.role === 'etudiant') {
            data = {
                total_candidatures: await Candidature.count({ where: { user_id: userId } }),
                total_entretiens: await Entretien.count({
                    include: {
                        model: Candidature,
                        where: { user_id: userId }
                    }
                }),
                total_evaluations: await Evaluation.count({ where: { stagiaire_id: userId } }),
            };
        } else if (user.role === 'entreprise') {
            data = {
                total_offres: await Offre.count({ where: { entreprise_id: userId } }),
                total_candidatures: await Candidature.count({
                    include: {
                        model: Offre,
                        where: { entreprise_id: userId },
                    },
                }),
                total_entretiens: await Entretien.count({
                    include: {
                        model: Candidature,
                        include: {
                            model: Offre,
                            where: { entreprise_id: userId }
                        }
                    }
                }),
            };
        } else if (user.role === 'encadrant') {
            data = {
                total_evaluations_donnees: await Evaluation.count({ where: { encadrant_id: userId } }),
            };
        } else if (user.role === 'demande_emploi') {
            data = {
                total_candidatures: await Candidature.count({ where: { user_id: userId } }),
                total_offres_postulees: await Candidature.count({ where: { user_id: userId } }),
            };
        }
        res.status(200).json({ message: "Tableau de bord récupéré", data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération du tableau de bord" });
    }
};
