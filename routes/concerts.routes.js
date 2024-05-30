const express = require('express');
const uuid = require('uuid');
const multer = require('multer');
const path = require('path');
const Concert = require('../models/concert.model');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/uploads');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const nameuuid = uuid.v4();
    const name = nameuuid.replaceAll('-', '');
    cb(null, `${name}${ext}`);
  }
});

const app = express();
const upload = multer({ storage: storage });
const router = express.Router();

app.use(express.static(path.join(__dirname, '/public')));

const pathReplace = path => {
  const newpath = path.replaceAll('\\', '/');
  return newpath;
};

router.get('/concerts', async (req, res) => {
  try {
    const concert = await Concert.find();
    if (concert.length === 0) {
      return res.status(404).json({ message: 'No concerts found' });
    } else {
      res.json(concert);
    };
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
});

router.get('/concerts/:id', async (req, res) => {
  try {
    const concert = await Concert.findById(req.params.id);
    if (!concert) {
      res.status(404).json({ message: 'Concert not found' });
    } else {
      res.json(concert);
    };
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
});

router.post('/concerts', upload.single('image'), async (req, res) => {
  const { performer, genre, price, day } = req.body;

  try {
    const image = req.file;
    const newpath = pathReplace(image.path);
    if (!isNaN(price) && !isNaN(day)) {
      if (performer && genre && price && day && image) {
        const newConcert = new Concert({ performer: performer, genre: genre, 
          price: price, day: day, image: newpath });
        await newConcert.save();
        res.json({ message: 'OK' });
      } else {
        res.status(400).json({ message: 'All fields are required' });
      }
    } else {
      res.status(400).json({ message: 'Price and day must be numbers' });
    };
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
});

router.delete('/concerts/:id', async (req, res) => {
  try {
    const concert = await Concert.findById(req.params.id);
    if (concert) {
      await Concert.deleteOne(concert);
      res.json(concert);
    } else {
      res.status(404).json({ message: 'Concerts not found' });
    };
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
});

router.put('/concerts/:id', upload.single('image'), async (req, res) => {
  const { performer, genre, price, day } = req.body;
  
  try {
    const image = req.file;
    const newpath = pathReplace(image.path);
    const concert = await Concert.findById(req.params.id);
    if (concert) {
      if (!isNaN(price) && !isNaN(day)) {
        if (performer && genre && price && day && image) {
          await Concert.updateOne({ _id: req.params.id }, 
            {$set: { performer: performer, genre: genre, price: price, day: day, image: newpath }});
          res.json(concert);
        } else {
          res.status(404).json({ message: 'All fields are required' });
        };
      } else {
        res.status(400).json({ message: 'Price and day must be numbers' });
      };
    } else {
      res.status(404).json({ message: 'Concert not found' });
    };
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
});

module.exports = router;