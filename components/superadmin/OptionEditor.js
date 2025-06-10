'use client';
import Image from 'next/image';

export default function OptionEditor({ index, value = { text: '', imageUrl: '' }, onChange }) {
  const handleTextChange = (e) => {
    onChange({ ...value, text: e.target.value });
  };

  return (
    <div className="my-2">
      <label className="font-semibold block mb-1">
        Option {String.fromCharCode(65 + index)}
      </label>
      <textarea
        className="w-full border p-2"
        placeholder={`Enter option ${String.fromCharCode(65 + index)} text`}
        value={value.text || ''}
        onChange={handleTextChange}
      />
      {value.imageUrl && (
        <div className="mt-2">
          <Image
            src={value.imageUrl}
            alt={`Option ${String.fromCharCode(65 + index)} Image`}
            width={150}
            height={150}
            className="rounded"
          />
        </div>
      )}
    </div>
  );
}
