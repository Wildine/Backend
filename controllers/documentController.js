const fs = require('fs');
const PDFDocument = require('pdfkit');
const { Document, Etudiant } = require('../models');

// Fonction pour générer un document
exports.generateDocument = async (req, res) => {
    const { userId, type } = req.body;

    try {
        // Recherche de l'étudiant en fonction du userId
        const etudiant = await Etudiant.findOne({ where: { id: userId } });
        if (!etudiant) {
            return res.status(404).json({ message: 'Étudiant non trouvé' });
        }

        // Création du document PDF avec pdfkit
        const doc = new PDFDocument();
        const fileName = `${etudiant.prenom}_${etudiant.nom}.pdf`;
        // const fileName = `${etudiant.prenom}_${etudiant.nom}_${Date.now()}.pdf`;
        const filePath = `./uploads/${fileName}`;
        
        let titre;
        // Définir les différentes sections en fonction du type de document
        switch (type) {
            case 'attestation':
                titre = `Attestation de Stage pour ${etudiant.prenom} ${etudiant.nom}`;
                doc.text(titre);
                doc.text('Atteste que l\'étudiant a effectué un stage dans notre entreprise.');
                break;
            case 'rapport_evaluation':
                titre = `Rapport d'Évaluation pour ${etudiant.prenom} ${etudiant.nom}`;
                doc.text(titre);
                doc.text('Évaluation des performances du stagiaire.');
                break;
            case 'lettre_acceptation':
                titre = `Lettre d'Acceptation de Stage pour ${etudiant.prenom} ${etudiant.nom}`;
                doc.text(titre);
                doc.text('Lettre confirmant l\'acceptation de la candidature pour un stage.');
                break;
            case 'convention_stage':
                titre = `Convention de Stage pour ${etudiant.prenom} ${etudiant.nom}`;
                doc.text(titre);
                doc.text('Détails sur la convention de stage.');
                break;
            case 'accord_confidentialite':
                titre = `Accord de Confidentialité pour ${etudiant.prenom} ${etudiant.nom}`;
                doc.text(titre);
                doc.text('Conditions de confidentialité signées par le stagiaire.');
                break;
            case 'contrat_chercheur_emploi':
                titre = `Contrat pour Chercheur d'Emploi pour ${etudiant.prenom} ${etudiant.nom}`;
                doc.text(titre);
                doc.text('Conditions du contrat pour un chercheur d\'emploi.');
                break;
            default:
                return res.status(400).json({ message: 'Type de document invalide' });
        }

        // Sauvegarder le fichier PDF sur le serveur
        doc.pipe(fs.createWriteStream(filePath));
        doc.end();

        // Sauvegarder le document dans la base de données
        const document = await Document.create({
            type,
            titre, // Utilisation du titre généré pour le document
            fichier: filePath,
            user_id: userId,
        });

        res.status(201).json({ message: 'Document généré avec succès', document });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la génération du document' });
    }
};



// Fonction pour télécharger un document
exports.downloadDocument = async (req, res) => {
    const { documentId } = req.params;

    try {
        const document = await Document.findByPk(documentId);
        if (!document) {
            return res.status(404).json({ message: 'Document non trouvé' });
        }

        res.download(document.fichier);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors du téléchargement du document' });
    }
};