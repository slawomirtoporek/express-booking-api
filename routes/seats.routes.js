const express = require('express');
const db = require('../db/db');
const uuid = require('uuid');
const app = express();

const router = express.Router();
app.use(express.json());

router.route('/seats').get((req, res) => {
  if (db.seats.length === 0) {
    return res.status(404).json({ message: 'No seats found' });
  } else {
    res.json(db.seats);
  };
});

router.route('/seats/:id').get((req, res) => {
  const id = req.params.id;
  const seat = db.seats.find(data => data.id.toString() === String(id));
  if (!seat) {
    res.status(404).json({ message: 'Seat not found' });
  } else {
    res.json(seat);
  };
});

router.route('/seats').post((req, res) => {
  const id = uuid.v4();
  const { day, seat, client, email } = req.body;
  if (!isNaN(day) && !isNaN(seat)) {
    if (id && day && seat && client && email) {
      const reservSeat = { id: id, day: day, seat: seat, client: client, email: email };
      const seatOccupied = db.seats.some((x) => x.day === reservSeat.day && x.seat === reservSeat.seat);
      if(!seatOccupied){
        db.seats.push(reservSeat);
        res.json({ message: 'OK' });
        } else {
          res.status(400).json({ message: 'The slot is already taken...' });
        }
    } else {
      res.status(400).json({ message: 'All fields are required' });
    };
  } else {
    res.status(400).json({ message: 'Day and seat must be numbers' });
  };
});

router.route('/seats/:id').delete((req, res) => {
  const id = req.params.id;
  const index = db.seats.findIndex(data =>  data.id.toString() === String(id));
  if (index !== -1) {
    db.seats = db.seats.filter(data => data.id.toString() !== String(id));
    res.json({ message: 'OK' });
  } else {
    res.status(404).json({ message: 'Seat not found' });
  };
});

router.route('/seats/:id').put((req, res) => {
  const id = req.params.id;
  const { day, seat, client, email } = req.body;
  const index = db.seats.findIndex(data =>  data.id.toString() === String(id));
  if (index !== -1) {
    if (day && seat && client && email) {
      db.seats[index] = { ...db.seats[index], day, seat, client, email };
      res.json({ message: 'OK' });
    } else {
      res.status(404).json({ message: 'All fields are required' });
    };
  } else {
    res.status(404).json({ message: 'Seat not found' });
  };
});

module.exports = router;