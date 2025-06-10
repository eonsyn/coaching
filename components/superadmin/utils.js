export function convertToSchema(raw, meta, level) {
  const mapOption = (text) => ({ text, imageUrl: "" });
  return {
    type: "MCQ",
    question: {
      text: raw.question,
      imageUrl: "",
    },
    options: {
      option1: mapOption(raw.options[0]),
      option2: mapOption(raw.options[1]),
      option3: mapOption(raw.options[2]),
      option4: mapOption(raw.options[3]),
    },
    correctOption: "", // can be added manually later
    answer: "",
    explanation: "",
    publication: "",
    subject: meta.subject,
    topic: meta.topic,
    unit: meta.unit,
    level,
    error: "",
    createdBy: null,
  };
}
