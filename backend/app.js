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

app.use((req, res, next) => {
    res.header('Access-Control-Expose-Headers', 'Content-Disposition');
    next();
});

app.use(cors({ origin: '*' }, {exposedHeaders: ['Content-Disposition']}));
app.use(express.json());
app.use(logger('dev'));
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use('/students',studentRoutes);
app.use('/faculty',facultyRoutes);
app.use('/mentors',mentorRoutes);
app.use('/admin',adminRoutes);
app.use('/freezeform',freezeformRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports =app;