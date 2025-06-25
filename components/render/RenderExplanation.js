// components/Explanation.js
import React from "react";
import { renderMathText } from "@/utils/renderMath";

const RenderExplanation = ({ data }) => {
  return (
    <div className="space-y-4">
      {data.map((block, index) => (
        <div key={index} className="flex flex-col gap-2">
          {/* Render LaTeX + text */}
          {block.text && (
            <div className="prose max-w-none">
              {renderMathText(block.text)}
            </div>
          )}

          {/* Render image if present */}
          {block.imageUrl && (
            <img
              src={block.imageUrl}
              alt={`explanation-${index}`}
              className="max-w-full rounded shadow"
              loading="lazy"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default RenderExplanation;
