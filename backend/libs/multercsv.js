const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

// Memory storage for CSV files
const memoryStorage = multer.memoryStorage();

// File filter function to accept only CSV files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'text/csv') {
    cb(null, true);  // Accept file
  } else {
    cb(new Error('Only CSV files are allowed'), false);  // Reject file
  }
};

// Multer upload configuration for CSV files
const uploadCsv = multer({
  storage: memoryStorage,
  fileFilter: fileFilter,
});

// Export multer instance, not the `single()` method
module.exports = uploadCsv;
