const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dest = '../backend/public/images/uploads'; // default path

    switch (file.fieldname) {
      case 'trainingLetter':
        dest = '../backend/public/images/trainingLetters';
        break;
      case 'feeReceipt':
        dest = '../backend/public/images/feeReceipts';
        break;
      case 'GoalReport':
        dest = '../backend/public/images/goalReports';
        break;
      case 'MidwayReport':
        dest = '../backend/public/images/midwayReports';
        break;
      case 'ReportFile':
        dest = '../backend/public/images/reportFiles';
        break;
      case 'ProjectPresentation':
        dest = '../backend/public/images/projectPresentations';
        break;
      case 'FinalTraining':
        dest = '../backend/public/images/finalTrainings';
        break;
      default:
        dest = '../backend/public/images/uploads'; // fallback
    }

    cb(null, dest);
  },

  filename: function (req, file, cb) {
    const uniqueFilename = uuidv4();
    cb(null, uniqueFilename + path.extname(file.originalname));
  }
});

const upload = multer({ storage });
module.exports = upload;
