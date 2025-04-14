const FeedbackQuestion = require("../models/feedbackQuestion.model");
const seedFeedbackQuestions = async () => {
  const count = await FeedbackQuestion.countDocuments();

  if (count === 0) {
    const feedbackQuestions = [
      "Engineering Knowledge: T.I.E.T. CSE students have an ability to apply the knowledge of mathematics, science, engineering fundamentals, and an engineering specialization to the solution of complex engineering problems.",
      "Problem Analysis: T.I.E.T. CSE students have an ability to identify, formulate, review research literature, and analyze complex engineering problems reaching substantiated conclusions using first principles of mathematics, natural sciences, and engineering sciences.",
      "Design/Development of Solutions: T.I.E.T. CSE students have an ability to design solutions for complex engineering problems and design system components or processes that meet the specified needs with appropriate consideration for the public health and safety, and the cultural, societal, and environmental considerations.",
      "Conduct Investigations of Complex Problems: T.I.E.T. CSE students have knowledge to use research-based knowledge and research methods including design of experiments, analysis and interpretation of data, and synthesis of the information to provide valid conclusions.",
      "Modern Tool Usage: T.I.E.T. CSE students have an ability to create, select, and apply appropriate techniques, resources, and modern engineering and IT tools including prediction and modeling to complex engineering activities with an understanding of the limitations.",
      "The Engineer and Society: T.I.E.T. CSE students have knowledge to apply reasoning informed by the contextual knowledge to assess societal, health, safety, legal and cultural issues and the consequent responsibilities relevant to the professional engineering practice.",
      "Environment and Sustainability: T.I.E.T. CSE students have an ability to understand the impact of the professional engineering solutions in societal and environmental contexts, and demonstrate the knowledge of, and need for sustainable development.",
      "Ethics: T.I.E.T. CSE students have an ability to apply ethical principles and commit to professional ethics and responsibilities and norms of the engineering practice.",
      "Individual and Teamwork: T.I.E.T. CSE students have knowledge to function effectively as an individual, and as a member or leader in diverse teams, and in multidisciplinary settings.",
      "Communication: T.I.E.T. CSE students have an ability to communicate effectively on complex engineering activities with the engineering community and with society at large, such as, being able to comprehend and write effective reports and design documentation, make effective presentations, and give and receive clear instructions.",
      "Project Management and Finance: T.I.E.T. CSE students have an ability to demonstrate knowledge and understanding of the engineering and management principles and apply these to one’s own work, as a member and leader in a team, to manage projects and in multidisciplinary environments.",
      "Life-Long Learning: T.I.E.T. CSE students have an ability to recognize the need for and have the preparation and ability to engage in independent and life-long learning in the broadest context of technological change.",
      "T.I.E.T. CSE students have an ability to apply the fundamentals of mathematics, science and engineering to identify, formulate, design and investigate engineering problems using efficient and effective computational techniques.",
      "T.I.E.T. CSE students have an ability to apply the appropriate engineering techniques using modern hardware and software tools in computer science and engineering to engage in lifelong learning, being ethical to successfully adapt in multi-disciplinary environment.",
    ];

    const questionDocs = feedbackQuestions.map((text) => ({ text }));
    await FeedbackQuestion.insertMany(questionDocs);

    console.log("✅ Feedback questions seeded into the database.");
  } else {
    console.log("ℹ️ Feedback questions already exist.");
  }
};

module.exports = seedFeedbackQuestions;
