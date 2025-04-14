const AbetQuestionStudent = require("../models/abetQuestionStudent.model");
const seedAbetQuestionsStudent = async () => {
  const count = await AbetQuestionStudent.countDocuments();

  if (count === 0) {
    const abetQuestionStudent = [
      "An ability to apply knowledge of mathematics, science, and engineering.",
      "An ability to design and conduct experiments, as well as to analyze and interpret data.",
      "An ability to design a system, component, or process to meet desired needs within realistic constraints such as economic, environmental, social, political, ethical, health and safety, manufacturability, and sustainability.",
      "An ability to function on multidisciplinary teams.",
      "An ability to identify, formulates, and solves engineering problems.",
      "An understanding of professional and ethical responsibility.",
      "An ability to communicate effectively.",
      "The broad education necessary to understand the impact of engineering solutions in a global, economic, environmental, and societal context.",
      "The recognition of the need for, and an ability to engage in life-long learning.",
      "The knowledge of contemporary issues.",
      "An ability to use the techniques, skills, and modern engineering tools necessary for engineering practice."
    ];

    const questionDocs = abetQuestionStudent.map((text) => ({ text }));
    await AbetQuestionStudent.insertMany(questionDocs);

    console.log("✅ Studebt Feedback Abet Questions seeded into the database.");
  } else {
    console.log("ℹ️ Studebt Feedback Abet Questions already exist.");
  }
};

module.exports = seedAbetQuestionsStudent;
