const express = require('express');
const path = require('path');
const uuid = require('uuid');
const database = require('./db/db.js');

const app = express();

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/testmonials', (req, res) => {
  res.json(database);
});

app.get('/testmonials/random', (req, res) => {
  const id = Math.floor(Math.random() * database.length)
  res.json(database[id]);
});

app.get('/testmonials/:id', (req, res) => {
  const id = req.params.id;
  res.json(database.find(data => data.id.toString() === String(id)));
});

app.post('/testmonials', (req, res) => {
  const id = uuid.v4();
  const { author, text } = req.body;
  database.push({ id, author, text });
  res.send({ message: 'OK' });
});

app.put('/testmonials/:id', (req, res) => {
  const id = req.params.id;
  const { author, text } = req.body;
  database[id] = { author, text };
  res.send({ message: 'OK' });
});

app.delete('/testmonials/:id', (req, res) => {
  const id = req.params.id;
  const index = database.findIndex(data => data.id === id);
  database.splice(index, 1);
  res.send({ message: 'OK' });
});

app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});