'use client';

import React, { useRef, useState } from 'react';
import domtoimage from 'dom-to-image';
import jsPDF from 'jspdf';
import { renderMathText } from '@/utils/renderMath';

function QuestionList({ questions }) {
  const contentRef = useRef(null);
  const [showAnswer, setshowAnswer] = useState(false)
  const [showoption, setshowoption] = useState(false);
  const [downloading, setdownloading] = useState(false)

  const handleDownloadPDF = async () => {
    setdownloading(true);

    const element = contentRef.current;
    if (!element) return;

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    let currentY = margin;

    const questionElements = element.querySelectorAll('.question-box');

    for (let i = 0; i < questionElements.length; i++) {
      const node = questionElements[i];

      const dataUrl = await domtoimage.toPng(node, {
        quality: 1,
        bgcolor: '#fff',
        width: node.scrollWidth,
        height: node.scrollHeight,
      });

      const img = new window.Image();
      img.src = dataUrl;

      await new Promise((resolve) => {
        img.onload = () => {
          const pxToMm = (px) => (px * 25.4) / 96;
          const imgWidthMm = pxToMm(img.width);
          const imgHeightMm = pxToMm(img.height);

          const scale = (pdfWidth - 2 * margin) / imgWidthMm;
          const scaledHeight = imgHeightMm * scale;

          if (currentY + scaledHeight > pdfHeight - margin) {
            pdf.addPage();
            currentY = margin;
          }

          pdf.addImage(
            dataUrl,
            'PNG',
            margin,
            currentY,
            imgWidthMm * scale,
            scaledHeight
          );
          currentY += scaledHeight + 4;
          resolve();
        };
      });
    }

    pdf.save('questions.pdf');
    setdownloading(false);
  };

  const toggleOption = () => {
    console.log(questions)
    if (!showAnswer) {
      setshowoption(!showoption);
    }

  };
  const toggleAnswer = () => {
    setshowAnswer(!showAnswer);
    setshowoption(false);
  };

  if (!questions || questions.length === 0) {
    return <p className="text-white">No questions to display.</p>;
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <button
          onClick={handleDownloadPDF}
          className="cursor-pointer mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >

          {downloading ? "Loading..." : "Download PDF"}
        </button>


        <button
          onClick={toggleAnswer}
          className="mb-4 cursor-pointer px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          {showAnswer ? 'Hide Answer' : 'Show Answer'}
        </button>
        {!showAnswer && <button
          onClick={toggleOption}
          className="mb-4 cursor-pointer px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {showoption ? 'Hide Options' : 'Show Options'}
        </button>}
      </div>

      <div
        ref={contentRef}
        className="space-y-6 bg-white text-black px-4 py-6 rounded-md"
        style={{ width: '800px', margin: '0 auto' }}
      >
        {questions.map((q, idx) => (
          <div key={q._id || idx} className="question-box px-2 rounded-md text-black">

            {showAnswer ? (<h3 className="font-semibold mb-2">
              Ans{idx + 1}: {renderMathText(q.answer) || renderMathText(q.correctOption) || renderMathText(q.explanation) || 'No Answer found'}
            </h3>) : (<h3 className="font-semibold w-[70vw] md:w-[60vw]  mb-2">
              Q{idx + 1}: {renderMathText(q.question?.text) || 'No question text'}
            </h3>)}

            {!showAnswer && q.question.imageUrl && (
              <img
                src={q.question.imageUrl}
                alt="Question image"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            )}
           
            {showoption && (
               <ol className="list-none list-inside mb-2">
              {Object.entries(q.options || {}).map(([key, val], i) => {
                const optionLabels = ['a', 'b', 'c', 'd', 'e', 'f'];
                return (
                  <li key={i} className="mb-1 flex gap-2">
                    <span className="font-semibold">{optionLabels[i]}.</span>
                    <span>
                      {val?.text?.trim()
                        ? renderMathText(val.text)
                        : 'Option is not provided'}
                    </span>

                    {val?.imageUrl && (
                      <img
                        src={val.imageUrl}
                        alt="Option image"
                        style={{ maxHeight: '150px', maxWidth: '250px' }}
                      />
                    )}
                  </li>
                );
              })}
            </ol>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default QuestionList;
