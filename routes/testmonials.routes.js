const express = require('express');
const db = require('../db/db');
const uuid = require('uuid');

const router = express.Router();

router.route('/testmonials').get((req, res) => {
  if (db.testmonials.length === 0) {
    return res.status(404).send({ message: 'No testmonials found' });
  } else {
    res.json(db.testmonials);
  };
});

router.route('/testmonials/random').get((req, res) => {
  const id = Math.floor(Math.random() * db.testmonials.length)
  if (db.testmonials.length === 0) {
    return res.status(404).send({ message: 'No testmonial found' });
  } else {
    res.json(db.testmonials[id]);
  };
});

router.route('/testmonials/:id').get((req, res) => {
  const id = req.params.id;
  const testmonial = db.testmonials.find(data => data.id.toString() === String(id));
  if (!testmonial) {
    res.status(404).send({ message: 'Testmonial not found' });
  } else {
    res.send(testmonial);
  };
});

router.route('/testmonials').post((req, res) => {
  const id = uuid.v4();
  const { author, text } = req.body;
  if (author && text) {
    db.testmonials.push({ id, author, text });
    res.send({ message: 'OK' });
  } else {
    res.status(400).send({ message: 'Author and text are required fields' });
  };
});

router.route('/testmonials/:id').put((req, res) => {
  const id = req.params.id;
  const { author, text } = req.body;
  const index = db.testmonials.findIndex(data =>  data.id.toString() === String(id));
  if (index !== -1) {
    if (author && text) {
      db.testmonials[index] = { ...db.testmonials[index], author, text };
      res.send({ message: 'OK' });
    } else {
      res.status(404).send({ message: 'Author and text are required fields' });
    };
  } else {
    res.status(404).send({ message: 'Testmonial not found' });
  };
});

router.route('/testmonials/:id').delete((req, res) => {
  const id = req.params.id;
  const index = db.testmonials.findIndex(data =>  data.id.toString() === String(id));
  if (index !== -1) {
    db.testmonials = db.testmonials.filter(data => data.id.toString() !== String(id));
    res.send({ message: 'OK' });
  } else {
    res.status(404).send({ message: 'Testmonial not found' });
  };
});

module.exports = router;