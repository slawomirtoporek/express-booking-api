const express = require('express');
const uuid = require('uuid');
const multer = require('multer');
const path = require('path');
const ConcertController = require('../controllers/concerts.controller');

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

app.use(express.static(path.join(__dirname, '/public')));

const router = express.Router();

router.get('/concerts', ConcertController.getAll);

router.get('/concerts/:id', ConcertController.getById);

router.post('/concerts', upload.single('image'), ConcertController.post);

router.put('/concerts/:id', upload.single('image'), ConcertController.put);

router.delete('/concerts/:id', ConcertController.delete);

module.exports = router;