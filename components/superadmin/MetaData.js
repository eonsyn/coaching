'use client'
import React, { useEffect, useState } from 'react'

function MetaData({ setMeta, meta }) {
  const [session, setSession] = useState('Class 11')
  const [unitOptions, setUnitOptions] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const selectedClass = session.replace(" ", "%20")
        const selectedSubject = meta.subject || 'Mathematics'

        const response = await fetch(`/api/syllabus?class=${selectedClass}&subject=${selectedSubject}`)
        const json = await response.json()

        if (json?.subjects?.[0]?.chapters) {
          const options = json.subjects[0].chapters.map(chapter => ({
            value: chapter,
            label: chapter,
          }))
          setUnitOptions(options)
        } else {
          setUnitOptions([])
        }
      } catch (err) {
        console.error("Failed to fetch syllabus:", err)
        setUnitOptions([])
      }
    }

    if (meta.subject) fetchData()
  }, [session, meta.subject])

  return (
    <div className="flex flex-wrap gap-4 my-4">
      {/* Class Selector */}
      <select
        name="class"
        onChange={(e) => setSession(e.target.value)}
        className="border p-2 flex-1"
        value={session}
      >
        <option value="Class 11">Class 11</option>
        <option value="Class 12">Class 12</option>
      </select>

      {/* Subject Input */}
      <select className="border p-2 flex-1" name="subject" onChange={(e) => setMeta({ ...meta, subject: e.target.value })} id="">
        <option value="Mathematics">Mathematics</option>
        <option value="Physics">Physics</option>
        <option value="Chemistry">Chemistry</option> 
      </select>
 

      {/* Topic Input */}
      <input
        className="border p-2 flex-1"
        placeholder="Topic"
        value={meta.topic}
        onChange={(e) => setMeta({ ...meta, topic: e.target.value })}
      />

      {/* Unit (Chapter) Dropdown */}
      <select
        className="border p-2 flex-1"
        value={meta.unit}
        onChange={(e) => setMeta({ ...meta, unit: e.target.value })}
      >
        <option value="">Select Unit </option>
        {unitOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default MetaData
