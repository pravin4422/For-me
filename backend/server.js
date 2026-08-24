require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const connectDB = require('./src/config/db');
const { initFirebase } = require('./src/config/firebase');
const routes = require('./src/routes');
const errorHandler = require('./src/middleware/errorHandler');
const limiter = require('./src/middleware/rateLimiter');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect services
connectDB();
initFirebase();

// Core middleware
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_ORIGIN, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(limiter);

// Routes
app.use('/api', routes);

// Centralized error handler
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
