const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const app = express();

// const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')

  next();
})

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers',
    'Origin, X-Reeuested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  next();
})

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes);

// Root Route Handler
app.get('/', (req, res) => {
  res.send('Welcome to Places API! Go to /api/places');
});

// 404 Handler
app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  return next(error);
});

// Error Handling Middleware
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});

// MongoDB Connection
mongoose
  .connect('mongodb+srv://abdullah:abdullah@realudemyprojectcluster.upazfda.mongodb.net/mern?retryWrites=true&w=majority')
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`db connected`);
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.log('Database connection failed:', err);
  });