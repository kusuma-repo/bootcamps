const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const errorHandler = require('./middleware/error');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
//const logger = require('./middleware/logger');
const connectDB = require('./config/db');

// Load Env variabel
dotenv.config({
  path: './config/config.env'
});
connectDB();

// Route files
const bootcamps = require('./routes/bootcamps.js');
const courses = require('./routes/courses.js');
const users = require('./routes/user')
const app = express();
// Body Parse json
app.use(express.json());

// load variabel Env
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));

}

// use cookieParser
app.use(cookieParser());
// File uploading
app.use(fileUpload());
// Set static folder
app.use(express.static(path.join(__dirname, 'public')));
// Lets Make router()
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/user', users);
// error errorHandler
app.use(errorHandler);



const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, console.log(`server is running in
  ${process.env.NODE_ENV} mode on port ${PORT}`.blue.bold));

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // close server
  server.close(() => process.exit(1));
})