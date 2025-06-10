import React, { useEffect, useState } from 'react'

export default function TestGeneration({ form, handleChange, handleSubmit, loading }) {
  const [subject, setsubject] = useState('Physics')
   
  const [optionSubject, setoptionSubject] = useState([])
  const inputFields = [
    {
      label: 'Subject',
      type: 'select',
      name: 'subject',
      options: [
        { value: 'Mathematics', label: 'Mathematics' },
        { value: 'Physics', label: 'Physics' },
        { value: 'Chemistry', label: 'Chemistry' },
      ],
    },
    {
      label: 'Unit',
      type: 'select',
      name: 'unit',
      options: optionSubject,
    },
    {
      label: 'Number of Questions',
      type: 'number',
      name: 'count',
      placeholder: 'Enter number',
    },
    {
      label: 'Difficulty Level',
      type: 'select',
      name: 'level',
      options: [

        { value: 'Easy', label: 'Easy' },
        { value: 'Medium', label: 'Medium' },
        { value: 'Hard', label: 'Hard' },
      ],
    },
    {
      label: 'Class Level',
      type: 'select',
      name: 'class',
      options: [

        { value: 'Class 11', label: 'Class 11' },
        { value: 'Class 12', label: 'Class 12' },

      ],
    },
  ]
useEffect(() => {
  const fetchData = async () => {
    try {
      const selectedClass=(form.class).replace(" ","%20");
       
      const response = await fetch(`/api/syllabus?class=${selectedClass}&subject=${subject}`);
      const json = await response.json();
       

      if (json?.subjects?.[0]?.chapters) {
        const options = json.subjects[0].chapters.map((chapter) => ({
          value: chapter,
          label: chapter,
        }));
        setoptionSubject(options);
      }
    } catch (err) {
      console.error("Failed to fetch syllabus:", err);
    }
  };

  if (subject) fetchData();
}, [subject,form.class]);

  useEffect(() => {
   
     setsubject(form.subject)

  }, [form.subject])


  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-darkblue rounded-xl p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {inputFields.map(({ label, type, name, options, placeholder }) => (
          <div key={name}>
            <label className="block mb-1 text-sm font-medium text-white">
              {label}
            </label>
            {type === 'select' ? (
              <select
                name={name}
                value={form[name]}
                onChange={handleChange}
                className="h-10 text-sm px-3 border rounded-md w-full text-darkblue bg-lightblue"
              >
                {options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={type}
                name={name}
                value={form[name]}
                onChange={handleChange}
                placeholder={placeholder || ''}
                min={type === 'number' ? '1' : undefined}
                className="h-10 px-3 border rounded-md w-full text-darkblue bg-lightblue"
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-md"
        >
          {loading ? 'Loading...' : 'Generate'}
        </button>
      </div>
    </form>
  )
}
