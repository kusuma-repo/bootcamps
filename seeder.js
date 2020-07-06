const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');

// Load Variabel dotenv
dotenv.config({
  path: './config/config.env'
});

// load models
const bootcamp = require('./models/Bootcamp');
const course = require('./models/Courses');
const user = require('./models/User');
const review = require('./models/Reviews');
// connectDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

// Read JSON Files
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, `utf-8`));
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, `utf-8`));
const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`, `utf-8`));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/_data/reviews.json`, `utf-8`));

const importData = async () => {
  try {
    await bootcamp.create(bootcamps);
    await course.create(courses);
    await user.create(users);
    await review.create(reviews);
    console.log('data succeded imported..'.green.inverse);
  } catch (e) {
    console.error(e);
  }
}

// Delete data
const deleteBootcamp = async () => {
  try {
    await bootcamp.deleteMany();
    await course.deleteMany();
    await user.deleteMany();
    await review.deleteMany();
    console.log('data deleted succeded'.blue.inverse);
    process.exit();
  } catch (e) {
    console.error(e);
  }
}
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteBootcamp();
}