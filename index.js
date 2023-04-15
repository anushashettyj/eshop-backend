const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();
const { PORT, MONGODB_URL} = process.env;
const routes = require('./routes');
const cors = require('cors');

app.use(express.json());

app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001']
}));
app.use('/', routes);

mongoose
  .connect(MONGODB_URL)
  .then(() => console.log('DB connected'))
  .catch((err) => console.log(err));

app.listen(PORT, () => console.log(`App listening on ${PORT}`) );