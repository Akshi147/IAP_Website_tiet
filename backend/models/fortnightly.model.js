const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fortnightlySchema = new Schema({
  studentId: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  reports: {
    type: Map,
    of: new Schema({
      report: {
        type: String,
      },
      isUnlocked: {
        type: Boolean,
        default: false
      }
    }),
    required: true,
    default: {
      'Jan 1-15': { report: '', isUnlocked: false },
      'Jan 16-31': { report: '', isUnlocked: false },
      'Feb 1-15': { report: '', isUnlocked: false },
      'Feb 16-28': { report: '', isUnlocked: false },
      'Mar 1-15': { report: '', isUnlocked: false },
      'Mar 16-31': { report: '', isUnlocked: false },
      'Apr 1-15': { report: '', isUnlocked: false },
      'Apr 16-30': { report: '', isUnlocked: false },
      'May 1-15': { report: '', isUnlocked: false },
      'May 16-31': { report: '', isUnlocked: false },
      'Jun 1-15': { report: '', isUnlocked: false },
      'Jun 16-30': { report: '', isUnlocked: false },
      'Jul 1-15': { report: '', isUnlocked: false },
      'Jul 16-31': { report: '', isUnlocked: false }
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Fortnightly', fortnightlySchema);