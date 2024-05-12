const express = require('express');
const path = require('path');
const uuid = require('uuid');
const db = require('./db/db');

const app = express();

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/testmonials', (req, res) => {
  res.json(db.testmonials);
});

app.get('/testmonials/random', (req, res) => {
  const id = Math.floor(Math.random() * db.testmonials.length)
  res.json(db.testmonials[id]);
});

app.get('/testmonials/:id', (req, res) => {
  const id = req.params.id;
  res.json(db.testmonials.find(data => data.id.toString() === String(id)));
});

app.post('/testmonials', (req, res) => {
  const id = uuid.v4();
  const { author, text } = req.body;
  db.testmonials.push({ id, author, text });
  res.send({ message: 'OK' });
});

app.put('/testmonials/:id', (req, res) => {
  const id = req.params.id;
  const { author, text } = req.body;
  db.testmonials[id] = { author, text };
  res.send({ message: 'OK' });
});

app.delete('/testmonials/:id', (req, res) => {
  const id = req.params.id;
  const index = db.testmonials.findIndex(data => data.id === id);
  db.splice(index, 1);
  res.send({ message: 'OK' });
});

app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});