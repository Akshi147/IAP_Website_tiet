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
const adminRoutes = require('./routes/admin.routes');
const freezeformRoutes = require('./routes/freezeform.routes');
const seedAbetQuestions = require('./utils/seedAbetQuestions');
const seedFeedbackQuestions = require('./utils/seedFeedbackQuestions');

app.use((req, res, next) => {
    res.header('Access-Control-Expose-Headers', 'Content-Disposition');
    next();
});

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(logger('dev'));
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
seedAbetQuestions();
seedFeedbackQuestions();
app.use('/students',studentRoutes);
app.use('/faculty',facultyRoutes);
app.use('/mentors',mentorRoutes);
app.use('/admin',adminRoutes);
app.use('/freezeform',freezeformRoutes);


module.exports =app;