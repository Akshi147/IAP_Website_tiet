const AbetQuestion = require('../models/abetQuestion.model');
const seedAbetQuestions = async () => {
    const count = await AbetQuestion.countDocuments();
  
    if (count === 0) {
      const abetQuestions = [
        "TIET CSE students have an ability to apply knowledge of mathematics, science, and engineering.",
        "TIET CSE students have an ability to design and conduct experiments, as well as to analyze and interpret data.",
        "TIET CSE students have an ability to design a system, component, or process to meet desired needs.",
        "TIET CSE students have an ability to function on multidisciplinary teams.",
        "TIET CSE students have an ability to identify, formulate, and solve engineering problems.",
        "TIET CSE students have an understanding of professional and ethical responsibility.",
        "TIET CSE students have an ability to communicate effectively.",
        "TIET CSE students have the broad education necessary to understand the impact of engineering solutions in a global, economic, environmental, and societal context.",
        "TIET CSE students have a recognition of the need for, and an ability to engage in life-long learning.",
        "TIET CSE students have a knowledge of contemporary issues.",
        "TIET CSE students have an ability to use the techniques, skills, and modern engineering tools necessary for engineering practice."
      ];
  
      const questionDocs = abetQuestions.map(text => ({ text }));
      await AbetQuestion.insertMany(questionDocs);
  
      console.log('✅ ABET questions seeded into the database.');
    } else {
      console.log('ℹ️ ABET questions already exist.');
    }
  };
  
  module.exports = seedAbetQuestions;