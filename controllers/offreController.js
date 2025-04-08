const { Offre, Entreprise, User } = require('../models');

// Ajouter une offre (réservé aux entreprises)
exports.addOffre = async (req, res) => {
    try {
        const { entrepriseId, titre, description, date_expiration, type_offre } = req.body;

        // Vérifier si l'entreprise existe
        const entreprise = await Entreprise.findByPk(entrepriseId, {
            include: [{ model: User, attributes: ['role'] }]
        });

        if (!entreprise) {
            return res.status(404).json({ message: "Entreprise non trouvée." });
        }

        // Vérifier que l'utilisateur associé est bien une entreprise
        if (entreprise.User.role !== "entreprise") {
            return res.status(403).json({ message: "Seules les entreprises peuvent publier des offres." });
        }

        // Créer l'offre
        const offre = await Offre.create({
            entreprise_id: entrepriseId,
            titre,
            description,
            date_expiration,
            type_offre
        });

        res.status(201).json({ message: "Offre publiée avec succès.", offre });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la publication de l'offre." });
    }
};

// Récupérer toutes les offres
exports.listeOffres = async (req, res) => {
    try {
        const offres = await Offre.findAll({ include: Entreprise });
        res.json(offres);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des offres." });
    }
};

// Récupérer une offre par ID
exports.getOffre = async (req, res) => {
    try {
        const offre = await Offre.findByPk(req.params.id, { include: Entreprise });
        if (!offre) return res.status(404).json({ message: "Offre non trouvée." });
        res.json(offre);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération de l'offre." });
    }
};

// Mettre à jour une offre (seulement l'entreprise propriétaire)
exports.updateOffre = async (req, res) => {
    try {
        const offre = await Offre.findByPk(req.params.id);
        if (!offre) return res.status(404).json({ message: "Offre non trouvée." });

        await offre.update(req.body);
        res.json({ message: "Offre mise à jour avec succès.", offre });

    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour de l'offre." });
    }
};

// Supprimer une offre (seulement l'entreprise propriétaire)
exports.deleteOffre = async (req, res) => {
    try {
        const offre = await Offre.findByPk(req.params.id);
        if (!offre) return res.status(404).json({ message: "Offre non trouvée." });

        await offre.destroy();
        res.json({ message: "Offre supprimée avec succès." });

    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression de l'offre." });
    }
};
