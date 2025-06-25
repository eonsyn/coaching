import QuestionCard from './QuestionCard';

export default function QuestionRenderer({ questions, meta, onUpdate }) {
   
  return (
    <div className="mt-6 space-y-6">
      {questions.map((q, idx) => (
        <QuestionCard
          key={idx}
          index={idx}
          rawData={q}
          meta={meta}
          onChange={(updated) => onUpdate(idx, updated)}
        />
      ))}
    </div>
  );
}
