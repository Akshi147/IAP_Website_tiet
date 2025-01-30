const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const logger = require('morgan');
const app = express();
const cookieParser = require('cookie-parser');
const connectDB = require('./db/db');
connectDB();
const cors = require('cors');
const studentRoutes = require('./routes/student.routes');
const facultyRoutes = require('./routes/faculty.routes');
const mentorRoutes = require('./routes/mentor.routes');
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(logger('dev'));
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use('/students',studentRoutes);
app.use('/faculty',facultyRoutes);
app.use('/mentors',mentorRoutes);



module.exports =app;