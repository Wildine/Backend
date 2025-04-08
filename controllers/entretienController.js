const { Entretien, Candidature } = require('../models');

// Creer un entretien
exports.createEntretien = async (req, res) => {
    const { date_entretien, candidature_id } = req.body;

    try {
        // Verifier si la candidature existe
        const candidature = await Candidature.findByPk(candidature_id);
        if (!candidature) {
            return res.status(404).json({ message: "Candidature non trouvee" });
        }

        // Creer l'entretien
        const entretien = await Entretien.create({ date_entretien, candidature_id });
        res.status(201).json({ message: "Entretien cree avec succes", entretien });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la creation de l'entretien" });
    }
};

// Modifier un entretien
exports.updateEntretien = async (req, res) => {
    const { id } = req.params;
    const { date_entretien, statut } = req.body;

    try {
        const entretien = await Entretien.findByPk(id);
        if (!entretien) {
            return res.status(404).json({ message: "Entretien non trouve" });
        }

        entretien.date_entretien = date_entretien || entretien.date_entretien;
        entretien.statut = statut || entretien.statut;
        await entretien.save();

        res.status(200).json({ message: "Entretien mis a jour", entretien });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la mise a jour de l'entretien" });
    }
};

// Supprimer un entretien
exports.deleteEntretien = async (req, res) => {
    const { id } = req.params;

    try {
        const entretien = await Entretien.findByPk(id);
        if (!entretien) {
            return res.status(404).json({ message: "Entretien non trouve" });
        }

        await entretien.destroy();
        res.status(200).json({ message: "Entretien supprime" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la suppression de l'entretien" });
    }
};

// Lister tous les entretiens
exports.getAllEntretiens = async (req, res) => {
    try {
        const entretiens = await Entretien.findAll();
        res.status(200).json(entretiens);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la recuperation des entretiens" });
    }
};

// Recuperer un entretien par ID
exports.getEntretienById = async (req, res) => {
    const { id } = req.params;

    try {
        const entretien = await Entretien.findByPk(id);
        if (!entretien) {
            return res.status(404).json({ message: "Entretien non trouve" });
        }

        res.status(200).json(entretien);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la recuperation de l'entretien" });
    }
};

exports.getEntretiensByCandidature = async (req, res) => {
    const { candidatureId } = req.params;

    try {
        const entretiens = await Entretien.findAll({
            where: { candidature_id: candidatureId }
        });

        if (!entretiens.length) {
            return res.status(404).json({ message: 'Aucun entretien trouvé pour cette candidature.' });
        }

        res.status(200).json(entretiens);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération des entretiens.' });
    }
};