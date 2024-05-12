const express = require('express');
const db = require('../db/db');
const uuid = require('uuid');

const router = express.Router();

router.route('/testmonials').get((req, res) => {
  res.json(db.testmonials);
});

router.route('/testmonials/random').get((req, res) => {
  const id = Math.floor(Math.random() * db.testmonials.length)
  res.json(db.testmonials[id]);
});

router.route('/testmonials/:id').get((req, res) => {
  const id = req.params.id;
  res.json(db.testmonials.find(data => data.id.toString() === String(id)));
});

router.route('/testmonials').post((req, res) => {
  const id = uuid.v4();
  const { author, text } = req.body;
  db.testmonials.push({ id, author, text });
  res.send({ message: 'OK' });
});

router.route('/testmonials/:id').put((req, res) => {
  const id = req.params.id;
  const { author, text } = req.body;
  db.testmonials[id] = { author, text };
  res.send({ message: 'OK' });
});

router.route('/testmonials/:id').delete((req, res) => {
  const id = req.params.id;
  const index = db.testmonials.findIndex(data => data.id === id);
  db.splice(index, 1);
  res.send({ message: 'OK' });
});

module.exports = router;