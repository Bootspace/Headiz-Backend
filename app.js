const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const port = process.env.PORT || 5000;
require('dotenv').config();
const authRoute = require('./routes/auth-route')
const catRoute = require('./routes/category-route');

// Initialising Express App
const app = express();

// Connecting mongoose
const DBConnector = process.env.DBCONNECT;

mongoose.connect(DBConnector, {
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: true,
  useNewUrlParser: true
})
.then((result) => {console.log('Database Connected')})
.catch((err) => {console.log(err)});


// Middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use

// Routes
app.use('/api/user/', authRoute);
app.use('/api/category/', catRoute);

// Getting a test Route
app.get('/', (req, res) => res.send("API Connected"));

app.listen(port, () => {
  console.log('Server running on Port: ' + port);
});