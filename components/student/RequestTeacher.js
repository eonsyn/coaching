'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export default function RequestTeacher({ user }) {
  const [teachers, setTeachers] = useState([]);
  const [requestedTeacher, setRequestedTeacher] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch all teachers for the dropdown
  useEffect(() => {
    async function fetchTeachers() {
      const res = await fetch('/api/teachers'); // assume this returns a list of all teachers
      const data = await res.json();
      setTeachers(data.teachers);
    }
    fetchTeachers();
  }, []);

  const sendRequest = async (teacherId) => {
    setLoading(true);
    try {
      const res = await fetch('/api/teacher/request', {
        method: 'POST',
        body: JSON.stringify({ teacherId }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Request sent to teacher!");
        setRequestedTeacher(teacherId);
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      toast.error("Failed to send request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Student Dashboard</h2>

      {requestedTeacher ? (
        <p className="text-green-600">Request sent to teacher ✅</p>
      ) : (
        <div>
          <p className="mb-2">Select a teacher to request access:</p>
          <div className="space-y-2">
            {teachers.map((teacher) => (
              <div key={teacher._id} className="flex items-center justify-between p-2 border rounded">
                <span>{teacher.name} ({teacher.email})</span>
                <button
                  onClick={() => sendRequest(teacher._id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Request"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
