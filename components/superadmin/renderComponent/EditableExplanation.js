// components/EditableExplanation.js
import React from "react";
import { renderMathText } from "@/utils/renderMath";
import ImageUploader from "../ImageUploader";

const EditableExplanation = ({ data, onChange }) => {
  const handleTextChange = (index, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], text: value };
    onChange(updated);
  };

  const handleImageChange = (index, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], imageUrl: value };
    onChange(updated);
  };

  const addBlock = () => {
    onChange([...data, { text: "", imageUrl: "" }]);
  };

  const removeBlock = (index) => {
    const updated = [...data];
    updated.splice(index, 1);
    onChange(updated);
  };

  return (
    <div className="space-y-6">

      {data.map((block, index) => (
        <div key={index} className="border p-4 rounded shadow-sm space-y-2">
          <label className="block text-sm font-medium">Explanation Text (LaTeX supported)</label>
          <textarea
            value={block.text || ""}
            onChange={(e) => handleTextChange(index, e.target.value)}
            className="w-full p-2 border rounded font-mono text-sm"
            placeholder="Enter explanation with $...$ LaTeX"
            rows={3}
          />

          <label className="block text-sm font-medium mt-2">Image URL (optional)</label>
          <input
            type="text"
            value={block.imageUrl || ""}
            onChange={(e) => handleImageChange(index, e.target.value)}
            className="w-full p-2 border rounded text-sm"
            placeholder="https://example.com/image.png"
          />
          <ImageUploader
            label="Upload Question Image"
            onUpload={(url) => handleImageChange(index, url)}
          />
          <div className="mt-2 text-xs text-gray-500">Preview:</div>
          <div className="prose max-w-none">{renderMathText(block.text)}</div>
          {block.imageUrl && (
            <img
              src={block.imageUrl}
              alt={`explanation-${index}`}
              className="mt-2 max-w-full rounded border"
            />
          )}

          <button
            type="button"
            className="text-red-500 text-xs mt-2"
            onClick={() => removeBlock(index)}
          >
            Remove this block
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addBlock}
        className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
      >
        + Add Explanation Block
      </button>

    </div>
  );
};

export default EditableExplanation;
