const { Candidature, User, Offre } = require('../models');

// Voir toutes les candidatures d'un utilisateur
exports.getCandidaturesByUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const candidatures = await Candidature.findAll({
            where: { user_id: userId },
            include: [{ model: Offre, attributes: ['titre', 'description'] }]
        });

        if (!candidatures.length) {
            return res.status(404).json({ message: 'Aucune candidature trouvée pour cet utilisateur.' });
        }

        res.status(200).json(candidatures);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération des candidatures.' });
    }
};

exports.postuler = async (req, res) => {
    const { userId, offreId } = req.body;

    try {
        // Vérifier si l'utilisateur existe
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Vérifier si l'offre existe
        const offre = await Offre.findByPk(offreId);
        if (!offre) {
            return res.status(404).json({ message: 'Offre non trouvée' });
        }

        // Vérifier si l'utilisateur a déjà postulé à cette offre
        const existingCandidature = await Candidature.findOne({ where: { user_id: userId, offre_id: offreId } });
        if (existingCandidature) {
            return res.status(400).json({ message: 'Vous avez déjà postulé à cette offre' });
        }

        // Créer la candidature
        const candidature = await Candidature.create({
            user_id: userId,
            offre_id: offreId,
            statut: 'en attente', // Par défaut, le statut est 'en attente'
        });

        res.status(201).json({ message: 'Candidature envoyée avec succès', candidature });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la candidature' });
    }
};

// Modifier le statut d'une candidature (accepter/rejeter)
exports.updateStatutCandidature = async (req, res) => {
    const { candidatureId } = req.params;
    const { statut } = req.body;

    try {
        // Vérifier si la candidature existe
        const candidature = await Candidature.findByPk(candidatureId);
        if (!candidature) {
            return res.status(404).json({ message: 'Candidature non trouvée' });
        }

        // Mettre à jour le statut de la candidature
        candidature.statut = statut || candidature.statut;
        await candidature.save();

        res.status(200).json({ message: 'Statut de la candidature mis à jour', candidature });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour du statut' });
    }
};


// Voir toutes les candidatures pour une offre
exports.getCandidaturesByOffre = async (req, res) => {
    const { offreId } = req.params;

    try {
        const candidatures = await Candidature.findAll({
            where: { offre_id: offreId },
            include: [{ model: User, attributes: ['email'] }] // Inclure l'utilisateur avec chaque candidature
        });

        if (!candidatures.length) {
            return res.status(404).json({ message: 'Aucune candidature trouvée pour cette offre.' });
        }

        res.status(200).json(candidatures);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération des candidatures pour cette offre.' });
    }
};

// Annuler une candidature
exports.deleteCandidature = async (req, res) => {
    const { candidatureId } = req.params;

    try {
        const candidature = await Candidature.findByPk(candidatureId);
        if (!candidature) {
            return res.status(404).json({ message: 'Candidature non trouvée' });
        }

        // Supprimer la candidature
        await candidature.destroy();

        res.status(200).json({ message: 'Candidature annulée' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la suppression de la candidature' });
    }
};
