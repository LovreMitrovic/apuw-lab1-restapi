const express = require('express');
const app = express();
const mongoose = require('mongoose');
const apiRouter = require('./routes/router');


mongoose.connect('mongodb://localhost:27017/apuw-lab1', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('strictQuery', true);
app.use(express.json());
app.use('/api', apiRouter);
app.use('/', express.static('public'));

app.listen(3000, () => {
  console.log('Server started on port 3000');
})

module.exports = app;