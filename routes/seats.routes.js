const express = require('express');
const db = require('../db/db');
const uuid = require('uuid');

const router = express.Router();

router.route('/seats').get((req, res) => {
  if (db.seats.length === 0) {
    return res.status(404).send({ message: 'No seats found' });
  } else {
    res.json(db.seats);
  };
});

router.route('/seats/:id').get((req, res) => {
  const id = req.params.id;
  const seat = db.seats.find(data => data.id.toString() === String(id));
  if (!seat) {
    res.status(404).send({ message: 'Seat not found' });
  } else {
    res.send(seat);
  };
});

router.route('/seats').post((req, res) => {
  const id = uuid.v4();
  const { day, seat, client, email } = req.body;
  if (!isNaN(day) && !isNaN(seat)) {
    if (id && day && seat && client && email) {
      db.seats.push({ id, day, seat, client, email });
      res.send({ message: 'OK' });
    } else {
      res.status(400).send({ message: 'All fields are required' });
    };
  } else {
    console.log('Day and seat must be numbers');
  };
});

router.route('/seats/:id').delete((req, res) => {
  const id = req.params.id;
  const index = db.seats.findIndex(data =>  data.id.toString() === String(id));
  if (index !== -1) {
    db.seats = db.seats.filter(data => data.id.toString() !== String(id));
    res.send({ message: 'OK' });
  } else {
    res.status(404).send({ message: 'Seat not found' });
  };
});

router.route('/seats/:id').put((req, res) => {
  const id = req.params.id;
  const { day, seat, client, email } = req.body;
  const index = db.seats.findIndex(data =>  data.id.toString() === String(id));
  if (index !== -1) {
    if (day && seat && client && email) {
      db.seats[index] = { ...db.seats[index], day, seat, client, email };
      res.send({ message: 'OK' });
    } else {
      res.status(404).send({ message: 'All fields are required' });
    };
  } else {
    res.status(404).send({ message: 'Seat not found' });
  };
});

module.exports = router;