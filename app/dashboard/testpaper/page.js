'use client'

import React, { useState, useEffect } from 'react'
import TestGeneration from '@/components/dashboard/testpaper/TestGeneration'
import QuestionList from '@/components/dashboard/testpaper/QuestionList'
export default function Page() {
  const [form, setForm] = useState({
    class: 'Class 11',
    subject: 'Mathematics',
    unit: '',
    type:'MCQ',
    count: 1,
    level: 'Medium',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [questions, setQuestions] = useState([])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setQuestions([])

    if (!form.subject || !form.level) {
      setError('Please select Subject and Level')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/question/fetch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: form.subject,
          unit: form.unit,
          type: form.type,
          level: form.level,
          count: Number(form.count) || 1,
        }),
      })

      const data = await res.json()
      console.log(data)

      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to fetch questions')
      } else {
        setQuestions(data.data)
      }
    } catch (err) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="p-4 max-w-3xl text-lightblue mx-auto">
      <TestGeneration
        form={form}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        loading={loading}
      />

      {error && <p className="mt-4 text-red-600">{error}</p>}

      {questions.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4 text-lightblue">Fetched Questions:</h2>
          <QuestionList questions={questions} />
        </div>
      )}
    </div>
  )
}
