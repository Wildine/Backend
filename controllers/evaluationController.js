const { Evaluation, User } = require('../models');

// Créer une évaluation
exports.createEvaluation = async (req, res) => {
    const { stagiaire_id, encadrant_id, note, commentaire } = req.body;

    try {
        // Vérifier si le stagiaire et l'encadrant existent
        const stagiaire = await User.findByPk(stagiaire_id);
        const encadrant = await User.findByPk(encadrant_id);

        if (!stagiaire || stagiaire.role !== 'etudiant') {
            return res.status(404).json({ message: 'Stagiaire non trouvé' });
        }
        if (!encadrant || encadrant.role !== 'encadrant') {
            return res.status(404).json({ message: 'Encadrant non trouvé' });
        }

        // Créer l'évaluation
        const evaluation = await Evaluation.create({ stagiaire_id, encadrant_id, note, commentaire });

        res.status(201).json({ message: 'Évaluation enregistrée avec succès', evaluation });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la création de l\'évaluation' });
    }
};

// Modifier une évaluation
exports.updateEvaluation = async (req, res) => {
    const { id } = req.params;
    const { note, commentaire } = req.body;

    try {
        const evaluation = await Evaluation.findByPk(id);
        if (!evaluation) {
            return res.status(404).json({ message: 'Évaluation non trouvée' });
        }

        evaluation.note = note || evaluation.note;
        evaluation.commentaire = commentaire || evaluation.commentaire;
        await evaluation.save();

        res.status(200).json({ message: 'Évaluation mise à jour', evaluation });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'évaluation' });
    }
};

// Supprimer une évaluation
exports.deleteEvaluation = async (req, res) => {
    const { id } = req.params;

    try {
        const evaluation = await Evaluation.findByPk(id);
        if (!evaluation) {
            return res.status(404).json({ message: 'Évaluation non trouvée' });
        }

        await evaluation.destroy();
        res.status(200).json({ message: 'Évaluation supprimée' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la suppression de l\'évaluation' });
    }
};

// Récupérer toutes les évaluations
exports.getAllEvaluations = async (req, res) => {
    try {
        const evaluations = await Evaluation.findAll({
            include: [
                { model: User, as: 'stagiaire', attributes: ['email'] },
                { model: User, as: 'encadrant', attributes: ['email'] }
            ]
        });

        res.status(200).json(evaluations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération des évaluations' });
    }
};

// Récupérer les évaluations d'un stagiaire
exports.getEvaluationsByStagiaire = async (req, res) => {
    const { stagiaireId } = req.params;

    try {
        const evaluations = await Evaluation.findAll({
            where: { stagiaire_id: stagiaireId },
            include: [{ model: User, as: 'encadrant', attributes: ['email'] }]
        });

        res.status(200).json(evaluations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération des évaluations' });
    }
};

// Récupérer les évaluations faites par un encadrant
exports.getEvaluationsByEncadrant = async (req, res) => {
    const { encadrantId } = req.params;

    try {
        const evaluations = await Evaluation.findAll({
            where: { encadrant_id: encadrantId },
            include: [{ model: User, as: 'stagiaire', attributes: ['email'] }]
        });

        res.status(200).json(evaluations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération des évaluations' });
    }
};
