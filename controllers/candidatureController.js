const { Candidature, Encadrant, Etudiant, User, Offre } = require('../models');
const { Op } = require('sequelize');

// Récupérer tous les candidats avec leurs offres pour une entreprise donnée
exports.getCandidaturesParEntreprise = async (req, res) => {
    const { entrepriseId } = req.params;

    try {
    const candidatures = await Candidature.findAll({
        include: [
        {
            model: Offre,
            where: { entreprise_id: entrepriseId },
            attributes: ['titre'],
        },
        {
            model: User,
            attributes: ['email'],
            include: [
            {
                model: Etudiant,
                attributes: ['prenom', 'nom']
            }
            ]
        }
        ]
    });

    res.json(candidatures);
    } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

exports.getEncadrantsByEntreprise = async (req, res) => {
    const entrepriseId = req.user.id;

    try {
    const entreprise = await Entreprise.findOne({ where: { user_id: entrepriseId } });
    if (!entreprise) return res.status(404).json({ message: 'Entreprise non trouvée' });

    // const encadrants = await Encadrant.findAll({
    //     include: {
    //     model: User,
    //     attributes: ['email', 'role'],
    //     },
    //     where: { entreprise_id: entreprise.id }
    // });
    const encadrants = await Encadrant.findAll({
        where: { entrepriseId },
        include: {
        model: User,
        attributes: ['email', 'role']
        }
    });

    res.json(encadrants);
    } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
    }
};

// exports.getAllEncadrants = async (req, res) => {
//     try {
//     const encadrants = await Encadrant.findAll({
//         include: {
//         model: User,
//         attributes: ['email', 'role']
//         }
//     });
//     res.json(encadrants);
//     } catch (err) {
//     res.status(500).json({ error: 'Erreur serveur' });
//     }
// };

// Voir toutes les candidatures d'un utilisateur
// exports.getCandidaturesTable = async (req, res) => {
//     const { entrepriseId } = req.params;

//     try {
//     const candidatures = await Candidature.findAll({
//         attributes: [], // Ne récupère aucune colonne de Candidature
//         include: [
//         {
//             model: Offre,
//             attributes: ['titre'], // Récupère seulement le titre de l'offre
//         }
//         ],
//         where: {
//         offre_id: entrepriseId,
//         }
//     });

//     // Retourne les titres d'offres uniquement
//     const titres = candidatures.map(c => c.Offre.titre);
//     res.json(titres);
//     } catch (error) {
//     res.status(500).json({ error: error.message });
//     }
// };

// exports.getCandidatsEntreprise = async (req, res) => {
//     const { entrepriseId } = req.params;

//     try {
//         const candidatures = await Candidature.findAll({
//             include: [
//                 {
//                     model: Offre,
//                     where: { entrepriseId },
//                     attributes: []
//                 },
//                 {
//                     model: User,
//                     attributes: ['prenom', 'nom', 'email']
//                 }
//             ]
//         });

//         const candidats = candidatures.map(c => ({
//             prenom: c.User.prenom,
//             nom: c.User.nom,
//             email: c.User.email
//         }));

//         res.status(200).json(candidats);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// exports.getCandidaturesByUser = async (req, res) => {
//     const { userId } = req.params;

//     try {
//         const candidatures = await Candidature.findAll({
//             where: { user_id: userId },
//             include: [{ model: Offre, attributes: ['titre', 'description'] }]
//         });

//         if (!candidatures.length) {
//             return res.status(404).json({ message: 'Aucune candidature trouvée pour cet utilisateur.' });
//         }

//         res.status(200).json(candidatures);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Erreur lors de la récupération des candidatures.' });
//     }
// };

// Recupere la totalite des candidatures en attend d'un entreprise
// Voir toutes les candidatures en attente d'un utilisateur (etudiant ou entreprise)
// exports.getCandidaturesByEntreprise = async (req, res) => {
//     const { entrepriseId } = req.params;

//     try {
//     const offres = await Offre.findAll({ where: { entreprise_id: entrepriseId } });
//     const offreIds = offres.map(o => o.id);

//     const candidatures = await Candidature.findAll({
//         where: { offre_id: offreIds },
//         include: [{ model: Offre }]
//     });

//     res.status(200).json(candidatures);
//     } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Erreur lors de la récupération.' });
//     }
// };

exports.getCandidaturesByEntreprise = async (req, res) => {
    const { entrepriseId } = req.params;

    try {
        // Récupérer toutes les offres pour l'entreprise
        const offres = await Offre.findAll({ where: { entreprise_id: entrepriseId } });
        const offreIds = offres.map(o => o.id);

        // Compter le nombre de candidatures en attente
        const count = await Candidature.count({
            where: {
                offre_id: offreIds,
                statut: 'en_attente'
            }
        });

        res.status(200).json({ count }); // Retourner seulement le nombre de candidatures en attente
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération.' });
    }
};

// Pour la table
// exports.getCandidaturesTable = async (req, res) => {
//     const { entrepriseId } = req.params;
//     try {
//     // Récupérer les IDs des offres de l'entreprise
//     const offres = await Offre.findAll({
//         where: { entreprise_id: entrepriseId },
//         attributes: ['id']
//     });
//     const offreIds = offres.map(o => o.id);
//     if (offreIds.length === 0) {
//         return res.json([]);
//     }

//     // Récupérer candidatures + offre + utilisateur en une seule requête
//     const candidatures = await Candidature.findAll({
//         where: {
//         offre_id: { [Op.in]: offreIds },
//         statut: 'en_attente'
//         },
//         include: [
//         { model: Offre, attributes: ['titre'] },
//         { model: User,  attributes: ['prenom','nom'] }
//         ],
//         order: [['createdAt', 'DESC']],
//         raw: true,    // renvoie un résultat “plat”
//         nest: true    // regroupe par modèle dans des sous-objets
//     });

//     // on renvoie tel quel, front peut lire offre.titre, User.prenom etc.
//     return res.json(candidatures);

//     } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: err.message });
//     }
// };

// exports.getCandidaturesByUser = async (req, res) => {
//     const { userId } = req.params;

//     try {
//         // Récupérer l'utilisateur
//         const user = await User.findByPk(userId);
//         if (!user) {
//             return res.status(404).json({ message: 'Utilisateur non trouvé' });
//         }

//         // Si l'utilisateur est une entreprise, récupérer ses offres
//         let candidatures;
//         if (user.role === 'entreprise') {
//             // Récupérer toutes les offres de l'entreprise
//             const offres = await Offre.findAll({
//                 where: { entreprise_id: userId },  // Assurez-vous que 'entreprise_id' est correct
//             });

//             if (!offres.length) {
//                 return res.status(404).json({ message: 'Aucune offre trouvée pour cette entreprise.' });
//             }

//             // Récupérer les candidatures en attente pour ces offres
//             // candidatures = await Candidature.findAll({
//             //     where: {
//             //         offre_id: {
//             //             [Op.in]: offres.map((offre) => offre.id), // Filtrer par les offres de l'entreprise
//             //         },
//             //         statut: 'en_attente',
//             //     },
//             //     include: [{ model: Offre, attributes: ['titre', 'description'] }],
//             // });
//             candidatures = await Candidature.findAll({
//                 where: {
//                     offre_id: {
//                         [Op.in]: offres.map((offre) => offre.id),
//                     },
//                     statut: 'en_attente',
//                 },
//                 attributes: ['statut'], // Inclut seulement le statut de la candidature
//                 include: [{ model: Offre, attributes: ['titre', 'date_debut'] }],
//             });
//         } else {
//             // Si l'utilisateur est un étudiant, récupérer toutes ses candidatures en attente
//             // candidatures = await Candidature.findAll({
//             //     where: {
//             //         user_id: userId,
//             //         statut: 'en_attente',
//             //     },
//             //     include: [{ model: Offre, attributes: ['titre', 'description'] }],
//             // });
//             candidatures = await Candidature.findAll({
//                 where: {
//                     user_id: userId,
//                     statut: 'en_attente',
//                 },
//                 attributes: ['statut'],
//                 include: [{ model: Offre, attributes: ['titre', 'date_debut'] }],
//             });
//         }

//         if (!candidatures.length) {
//             return res.status(404).json({ message: 'Aucune candidature en attente trouvée.' });
//         }

//         res.status(200).json(candidatures);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Erreur lors de la récupération des candidatures.' });
//     }
// };

exports.getCandidaturesByUser = async (req, res) => {
const { userId } = req.params;
try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    // Récupère les IDs des offres selon le rôle comme avant…
    const offres = user.role === 'entreprise'
    ? await Offre.findAll({ where: { entreprise_id: userId } })
    : null;

    const where = user.role === 'entreprise'
    ? { offre_id: { [Op.in]: offres.map(o => o.id) }, statut: 'en_attente' }
    : { user_id: userId, statut: 'en_attente' };

    const candidatures = await Candidature.findAll({
    where,
    // Ne sélectionne que ces champs dans la table Candidature :
    attributes: ['statut', 'createdAt'],
    include: [
        {
        model: Offre,
        // Ne sélectionne que le titre de l’offre :
        attributes: ['titre']
        }
    ]
    });

    if (!candidatures.length) {
    return res.status(404).json({ message: 'Aucune candidature en attente trouvée.' });
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
            statut: 'en_attente',
        });

        res.status(201).json({ message: 'Candidature envoyée avec succès', candidature });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la candidature' });
    }
};

// Modifier le statut d'une candidature (accepter/rejeter)
// Fonction de mise à jour du statut de la candidature (acceptée ou rejetée)
// exports.updateStatutCandidature = async (req, res) => {
//     const { candidatureId } = req.params;
//     const { statut } = req.body;

//     try {
//         // Vérifier si la candidature existe
//         const candidature = await Candidature.findByPk(candidatureId);

//         if (!candidature) {
//             return res.status(404).json({ message: 'Candidature non trouvée' });
//         }

//         // Vérifier que le statut est valide (acceptée ou rejetée)
//         if (statut !== 'acceptée' && statut !== 'rejetée') {
//             return res.status(400).json({ message: 'Statut invalide. Utilisez "acceptée" ou "rejetée".' });
//         }

//         // Vérifier si le statut de la candidature a déjà été fixé (acceptée ou rejetée)
//         if (candidature.statut === 'acceptée' || candidature.statut === 'rejetée') {
//             return res.status(400).json({ message: 'Le statut de cette candidature ne peut plus être modifié.' });
//         }

//         // Mise à jour du statut de la candidature
//         candidature.statut = statut;
//         await candidature.save();

//         res.status(200).json({ message: `Candidature ${statut} avec succès.`, candidature });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Erreur lors de la mise à jour du statut de la candidature' });
//     }
// };

exports.updateStatutCandidature = async (req, res) => {
    const { candidatureId } = req.params;
    const { statut } = req.body;

    try {
        // Vérifier si la candidature existe
        const candidature = await Candidature.findByPk(candidatureId);

        if (candidature.statut === 'rejete' && statut === 'accepte') {
            return res.status(400).json({ message: 'Impossible d’accepter une candidature déjà rejetée.' });
        }

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
            include: [{ model: User, attributes: ['email'] }]
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

// Récupérer le nombre de candidatures acceptées pour une entreprise
// exports.getCandidaturesAccepteesByEntreprise = async (req, res) => {
//     const { entrepriseId } = req.params;

//     try {
//         // Récupérer toutes les offres de l'entreprise
//         const offres = await Offre.findAll({ where: { entreprise_id: entrepriseId } });
//         const offreIds = offres.map(offre => offre.id);

//         // Récupérer le nombre de candidatures acceptées pour ces offres
//         const totalCandidaturesAcceptees = await Candidature.count({
//             where: {
//                 offre_id: offreIds,
//                 statut: 'accepte',
//             }
//         });

//         // Vérifier si des candidatures ont été trouvées
//         // if (totalCandidaturesAcceptees === 0) {
//         //     return res.status(404).json({ message: 'Aucune candidature acceptée trouvée pour cette entreprise.' });
//         // }

//         // Retourner le nombre total de candidatures acceptées
//         res.status(200).json({ totalCandidaturesAcceptees });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Erreur lors de la récupération des candidatures acceptées.' });
//     }
// };


// // Récupérer le nombre de candidatures rejetees pour une entreprise
// exports.getCandidaturesRejeteesByEntreprise = async (req, res) => {
//     const { entrepriseId } = req.params;

//     try {
//     const offres = await Offre.findAll({ where: { entreprise_id: entrepriseId } });
//     const offreIds = offres.map(offre => offre.id);

//     const totalCandidaturesRejetees = await Candidature.count({
//         where: {
//         offre_id: offreIds,
//         statut: 'rejete',
//         }
//     });

//     res.status(200).json({ totalCandidaturesRejetees });
//     } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Erreur lors de la récupération des candidatures rejetées.' });
//     }
// };

exports.getCandidaturesAccepteesByEntreprise = async (req, res) => {
    const { entrepriseId } = req.params;

    try {
        // Récupérer toutes les offres de l'entreprise
        const offres = await Offre.findAll({ where: { entreprise_id: entrepriseId } });
        const offreIds = offres.map(offre => offre.id);

        // Récupérer le nombre de candidatures acceptées pour ces offres
        const totalCandidaturesAcceptees = await Candidature.count({
            where: {
                offre_id: offreIds,
                statut: 'accepte',
            }
        });

        // Si aucune candidature acceptée, renvoyer une réponse appropriée
        if (totalCandidaturesAcceptees === 0) {
            return res.status(404).json({ message: 'Aucune candidature acceptée trouvée pour cette entreprise.' });
        }

        // Retourner le nombre total de candidatures acceptées
        return res.status(200).json({ totalCandidaturesAcceptees });
    } catch (error) {
        console.error(error);
        // Assurez-vous que la réponse n'est envoyée qu'une seule fois
        if (!res.headersSent) {
            return res.status(500).json({ message: 'Erreur lors de la récupération des candidatures acceptées.' });
        }
    }
};

exports.getCandidaturesRejeteesByEntreprise = async (req, res) => {
    const { entrepriseId } = req.params;

    try {
        const offres = await Offre.findAll({ where: { entreprise_id: entrepriseId } });
        const offreIds = offres.map(offre => offre.id);

        const totalCandidaturesRejetees = await Candidature.count({
            where: {
                offre_id: offreIds,
                statut: 'rejete',
            }
        });

        return res.status(200).json({ totalCandidaturesRejetees });
    } catch (error) {
        console.error(error);
        // Assurez-vous que la réponse n'est envoyée qu'une seule fois
        if (!res.headersSent) {
            return res.status(500).json({ message: 'Erreur lors de la récupération des candidatures rejetées.' });
        }
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
