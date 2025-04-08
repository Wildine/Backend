const express = require('express');
const mysql = require('mysql2');
const sequelize = require('./config/db');
const cors = require('cors');
const bodyParser = require('body-parser');

const localhost = '127.0.0.1';
const port = 3000;

require('dotenv').config();

const authMiddleware = require('./middleware/authMiddleware');

// Importation des differents routes 
const authRoutes = require('./routes/authRoutes');
const usersRoutes = require('./routes/usersRoutes');
const offresRoutes = require('./routes/offresRoutes');
// const postulationRoutes = require('./routes/postulationRoutes.js.old');
const candidatureRoutes = require('./routes/candidatureRoutes');
const entretienRoutes = require('./routes/entretienRoutes');
const evaluationRoutes = require('./routes/evaluationRoutes');
// const documentRoutes = require('./routes/documentRoutes.js.old');
const documentRoutes = require('./routes/documentRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const statistiqueRoutes = require('./routes/statistiqueRoutes');


// Importation de swagger pour la documentation 
const swaggerUi = require('swagger-ui-express'); 
const swaggerDocument = require('./swagger-output.json'); 

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/offres', offresRoutes);
app.use('/api/dashboard', dashboardRoutes)
// app.use('/api/postulations', postulationRoutes);
app.use('/api/candidatures', candidatureRoutes);
app.use('/api/entretiens', entretienRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/statistiques', statistiqueRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

sequelize.sync()
    .then(() => {
        console.log('Base de donnees syncronisee');
    })
    .catch((error) => {
        console.error('Erreur de connexion Sequelize', error);
    });

app.listen(port, () => {
    console.log(`Le serveur demarre sur ${localhost}:${port}`);
});

