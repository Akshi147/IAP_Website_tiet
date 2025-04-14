const FeedbackQuestionStudent = require('../models/feedbackQuestionStudent.model');
const seedFeedbackQuestionsStudent = async () => {
    const count = await FeedbackQuestionStudent.countDocuments();
  
    if (count === 0) {
      const feedbackQuestions = [
        "Overall, how would you rate the experience during 8th semester?",
        "Would you like to recommend for having full alternate semester instead of industrial exposure in the last semester/project semester?",
        "Rate the importance of project semester in the graduate curriculum",
        "Overall, how would you rate the student life experience during project semester?",
        "Overall, how would you rate the personal development opportunity while doing project semester?",
        "Overall, how would you rate the professional development opportunity during project semester?",
        "Rate the worth of assistance provided by the computer science & engineering department to you for executing the project semester:",
        "How much you rate for the assistance / support provided by the faculty coordinator assigned to you:",
        "Rate the quality of academic/practical advising and guidance given by the mentor at industry/software house:",
        "Were there some additional benefits given by your company?",
        "What is the tentative per month cost that incurred for accommodation and meals?",
        "Who has arranged/managed for your commuting facility?",
        "Would you like to recommend your juniors to join the organization where you have worked?",
        "Do you think that CSED, TU may have some collaboration with the organization where you have completed your training? (Collaboration in terms of outsourcing the task related to the project development, project testing, system design etc.)",
        "If you think that CSED, TU may have some collaboration with your organization, then please suggest some personnel to whom the department may contact",
        "How would you see the significance of the faculty visits?",
        "List any subject/s that you feel that it is of practical importance in the industry and you are already having it in your academic curriculum:",
        "List any subject/s that you feel that it is of practical importance in the industry and is/are missing from your academic curriculum:",
        "Overall, how would you rate the handling of all project semester activities done by the IAP cell:",
        "Overall, how would you rate the communication and handling of all project semester activities by the IAP coordinator:",
        "How would you rate the IAP cell and their activities, when compared with the project semester activities followed for the students from different university / college doing their project semester with you / or in your organization?",
        "Do you have any further thoughts or comments you wish to share?",
      ];
  
      const questionDocs = feedbackQuestions.map(text => ({ text }));
      await FeedbackQuestionStudent.insertMany(questionDocs);
  
      console.log('✅ student feedback questions seeded into the database.');
    } else {
      console.log('ℹ️ student feedback questions already exist.');
    }
  };
  
  module.exports = seedFeedbackQuestionsStudent;