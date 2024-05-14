const express = require('express');
const db = require('../db/db');
const uuid = require('uuid');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'img/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const pathReplace = path => {
  const newpath = path.replaceAll('\\', '/');
  return newpath;
};

const app = express();
const upload = multer({ storage: storage });
const router = express.Router();

app.use(express.static(path.join(__dirname, '/img')));

router.route('/concerts').get((req, res) => {
  if (db.concerts.length === 0) {
    return res.status(404).send({ message: 'No concerts found' });
  } else {
    res.json(db.concerts);
  };
});

router.route('/concerts/:id').get((req, res) => {
  const id = req.params.id;
  const concert = db.concerts.find(data => data.id.toString() === String(id));
  if (!concert) {
    res.status(404).send({ message: 'Concert not found' });
  } else {
    res.send(concert);
  };
});

router.route('/concerts').post(upload.single('image'), (req, res) => {
  const id = uuid.v4();
  const { performer, genre, price, day } = req.body;
  const image = req.file;
  const newpath = pathReplace(image.path);
  if (!isNaN(price) && !isNaN(day)) {
    if (performer && genre && price && day && image) {
      db.concerts.push({ id, performer, genre, price, day, image: newpath });
      res.send({ message: 'OK' });
    } else {
      res.status(400).send({ message: 'All fields are required' });
    }
  } else {
    res.status(400).send({ message: 'Price and day must be numbers' });
  };
});

router.route('/concerts/:id').delete((req, res) => {
  const id = req.params.id;
  const index = db.concerts.findIndex(data =>  data.id.toString() === String(id));
  if (index !== -1) {
    db.concerts = db.concerts.filter(data => data.id.toString() !== String(id));
    res.send({ message: 'OK' });
  } else {
    res.status(404).send({ message: 'Concerts not found' });
  };
});

router.route('/concerts/:id').put(upload.single('image'), (req, res) => {
  const id = req.params.id;
  const { performer, genre, price, day } = req.body;
  const image = req.file;
  const newpath = pathReplace(image.path);
  const index = db.concerts.findIndex(data =>  data.id.toString() === String(id));
  if (index !== -1) {
    if (!isNaN(price) && !isNaN(day)) {
      if (performer && genre && price && day && image) {
        db.concerts[index] = { ...db.concerts[index], performer, genre, price, day, image: newpath };
        res.send({ message: 'OK' });
      } else {
        res.status(404).send({ message: 'All fields are required' });
      };
    } else {
      res.status(400).send({ message: 'Price and day must be numbers' });
    };
  } else {
    res.status(404).send({ message: 'Concert not found' });
  };
});

module.exports = router;