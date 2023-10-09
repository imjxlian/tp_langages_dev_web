import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import faker from 'faker';

import Sequelize from 'sequelize';

// Initialisation serveur
const app = express();
// Sécurité
app.use(cors());
// Configuration parser body
app.use(bodyParser.json());

// Configuration Faker
faker.locale = 'fr';

/* Partie Sequelizer */
// Connexion à la base de donnée avec Sequelize
const sequelize = new Sequelize('sqlite:database-chat.db');

// Modèle Pari avec Sequelize
const Bet = sequelize.define('bet', {
    auteur: { type: Sequelize.STRING },
    cheval: { type: Sequelize.INTEGER },
});

// Modèle User avec Sequelize
const User = sequelize.define('user', {
    username: { type: Sequelize.STRING },
    password: { type: Sequelize.STRING },
});

// Création des tables
Bet.sync({ force: true }).then(() => console.log('Table paris créée'));
User.sync({ force: true }).then(() => {
    console.log('Table user créée');

    User.create({
        username: 'alice',
        password: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    });
    User.create({
        username: 'bob',
        password: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    });
});


/* Routes Express */
// Route /
app.get('/', (req, res) =>  {
    res.send('Server is OK :)');
});

// Récupération de tous les paris
app.get('/paris', async (req, res) => {
    try {
        const paris = await Bet.findAll({ order: sequelize.literal('createdAt DESC') });

        return res.json(paris);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

// Ajout d'un pari
app.post('/paris', async (req, res) => {
    const { auteur, cheval } = req.body;

    try {
        const pari = await Bet.create({ auteur, cheval });

        io.emit('PARI_ADDED', pari);

        res.status(201).send('Pari créé');
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

// Génération de 10 paris aléatoires
app.post('/paris/generate', async (req, res) => {
    const NB_VALUES = 10;

    try {
        await Promise.all(Array.from({ length: NB_VALUES }).map(async () => {
            const auteur = faker.name.firstName();
            const cheval = faker.random.number({ min: 1, max: 10 });

            await Bet.create({ auteur, cheval });
        }));

        io.emit('PARIS_ADDED');

        return res.status(201).send('10 Paris créés');
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

// Suppression d'un pari
app.delete('/paris/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await Bet.destroy({ where: { rowid: id } });

        io.emit('PARI_DELETED', id);

        return res.status(200).send('Pari supprimé');
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

// Suppression de tous les paris
app.delete('/paris', async (req, res) => {
    try {
        await Bet.destroy({ where: {}, truncate: true });

        io.emit('PARIS_DELETED');

        return res.status(200).send('Paris supprimés');
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

// Login
app.post('/login', async (req, res) => {
    const { username, hashedPassword: password } = req.body;

    try {
        const users = await User.findAll({ where: { username, password } });

        if (users.length) {
            res.status(200).send('Connexion réussie');
        } else {
            res.status(403).send('Connexion impossible');
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});


/* Démarrage serveur */
const server = app.listen(3000, () => {
    console.log('Serveur phe-backend démarré !');
});

import { Server } from 'socket.io';
const io = new Server(server, { cors: { origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] } });
io.on('connection', socket => console.log('Connection ' + socket.id));