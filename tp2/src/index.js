'use strict;';

import express from 'express';
import faker from 'faker';
import cors from 'cors';
import bodyParser from 'body-parser';

import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

sqlite3.verbose();

// Initialisation serveur
const app = express();
// Sécurité
app.use(cors());
// Configuration parser body
app.use(bodyParser.json());

// Configuration Faker
faker.locale = 'fr';


/* Routes Express */
// Route /
app.get('/', (req, res) => {
  res.send('Bienvenue sur le serveur phe-backend !');
});

// Récupération de tous les paris avec SQLite
app.get('/paris', async (req, res) => {
  try {
    const paris = await db.all(`SELECT rowid AS id, * FROM paris ORDER BY date DESC`);
    res.status(200).json(paris);
  } catch (e) {
    res.status(500).send('Internal server error');
  };
});

// Ajout d'un pari avec SQLite
app.post('/paris', async (req, res) => {
  const { auteur, cheval } = req.body;
  const date = new Date().toISOString();

  if (!auteur || !cheval) {
    res.status(400).send('Bad request');
    return;
  }

  try {
    db.run(`INSERT INTO paris(auteur, cheval, date) VALUES(?, ?, ?)`, [auteur, cheval, date]);
    console.log(`Nouveau pari de ${auteur} sur le cheval ${cheval} à ${date}`);
    res.status(201).send('Created');
  } catch (e) {
    res.status(500).send('Internal server error');
  };
});

// Génération de 10 paris aléatoires avec SQLite
app.post('/paris/generate', async (req, res) => {
  const nbParis = 10;

  try {
      // Creation de la transaction
      await db.run(`BEGIN`);

      const insertPromises = [];

      for (let i = 0; i < nbParis; i++) {
          const auteur = faker.name.firstName();
          const cheval = faker.random.number({ min: 1, max: 10 });
          const date = faker.date.past().toISOString();

          const insertPromise = db.run(`INSERT INTO paris(auteur, cheval, date) VALUES(?, ?, ?)`, [auteur, cheval, date]);
          insertPromises.push(insertPromise);

          console.log(`Nouveau pari de ${auteur} sur le cheval ${cheval} à ${date}`);
      }

      // Attente des promesses
      await Promise.all(insertPromises);

      // Commit de la transaction
      await db.run(`COMMIT`);

      res.status(201).send('Created');
  } catch (e) {
      // Rollback si erreur
      await db.run(`ROLLBACK`);
      res.status(500).send('Internal server error');
  }
});

// Suppression d'un pari avec SQLite
app.delete('/paris/:id', async (req, res) => {
  const { id } = req.params;

  try {
    db.run(`DELETE FROM paris WHERE rowid = ?`, [id]);
    res.status(200).send('OK');
    console.log(`Suppression du pari n°${id}`);
  } catch (e) {
    res.status(500).send('Internal server error');
  };
});


/* Partie SQLite */
let db;
async function initDatabase() {
    // Connexion à la base de donnée avec SQLite
    db = await open({ filename: 'database-phe.db', driver: sqlite3.Database });

    // Initialisation de la table paris
    db.run(`DROP TABLE if exists paris`)
      .then(() => {
        db.run(`CREATE TABLE paris(auteur text, cheval integer, date text)`);
      });

    console.log('Base de donnée initialisée');
}


/* Démarrage BDD et serveur */
initDatabase().then(() =>
    app.listen(3000, () =>
        console.log('Serveur phe-backend démarré !'),
    ),
);
