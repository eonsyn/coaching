'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function AddStudent({ user }) {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const res = await fetch('/api/teacher/requests');
    const data = await res.json();
    setRequests(data.requests);
  };

  const approveStudent = async (studentId) => {
    try {
      const res = await fetch('/api/teacher/approve', {
        method: 'POST',
        body: JSON.stringify({ studentId }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Student approved!");
        fetchRequests(); // Refresh list
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      toast.error("Approval failed");
    }
  };

  return (
    <div className="p-6 bg-white shadow rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Teacher Dashboard</h2>

      {requests.length === 0 ? (
        <p className="text-gray-600">No student requests at the moment.</p>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => (
            <div key={req.studentId} className="flex justify-between items-center border p-3 rounded">
              <div>
                <p className="font-medium">{req.name}</p>
                <p className="text-sm text-gray-500">ID: {req.studentId}</p>
              </div>
              <button
                onClick={() => approveStudent(req.studentId)}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              >
                Approve
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
