const express = require('express');
const path = require('path');
const testmonialsRoutes = require('./routes/testmonials.routes');

const app = express();

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/api', testmonialsRoutes)


app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});