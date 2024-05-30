const Seat = require('../models/seat.model');

exports.getAll = async (req, res) => {
  try {
    const seats = await Seat.find();
    if (seats.length === 0) {
      return res.status(404).json({ message: 'No seats found' });
    } else {
      res.json(seats);
    };
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.getById = async (req, res) => {
  try {
    const seat = await Seat.findById(req.params.id);
    if (!seat) {
      res.status(404).json({ message: 'Seat not found' });
    } else {
      res.json(seat);
    };
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.post = async (req, res) => {
  const { day, seat, client, email } = req.body;

  try {
    if (!isNaN(day) && !isNaN(seat)) {
      if (day && seat && client && email) {
        const reservSeat = { day: day, seat: seat, client: client, email: email };
        const seatOccupied = await Seat.findOne({ day: reservSeat.day, seat: reservSeat.seat });
        if(!seatOccupied) {
          const newSeat = new Seat(reservSeat);
          await newSeat.save();
          req.io.emit('seatsUpdated', await Seat.find());
          res.json({ message: 'OK' });
        } else {
          res.status(400).json({ message: 'The slot is already taken...' });
        };
      } else {
        res.status(400).json({ message: 'All fields are required' });
      }
    } else {
      res.status(400).json({ message: 'Day and price must be numbers' });
    };
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.put = async (req, res) => {
  const { day, seat, client, email } = req.body;
  
  try {
    const seatUpdate = await Seat.findById(req.params.id);
    if (seatUpdate) {
      if (!isNaN(day) && !isNaN(seat)) {
        if (day && seat && client && email) {
          await Seat.updateOne({ _id: req.params.id }, 
            {$set: { day: day, seat: seat, client: client, email: email }});
          res.json(seatUpdate);
        } else {
          res.status(404).json({ message: 'All fields are required' });
        };
      } else {
        res.status(400).json({ message: 'Day and price must be numbers' });
      };
    } else {
      res.status(404).json({ message: 'Seat not found' });
    };
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.delete = async (req, res) => {
  try {
    const seat = await Seat.findById(req.params.id);
    if (seat) {
      await Seat.deleteOne(seat);
      res.json(seat);
    } else {
      res.status(404).json({ message: 'Seat not found' });
    };
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};