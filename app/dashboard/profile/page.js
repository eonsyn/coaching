'use client';

import { useEffect, useState } from 'react';

export default function Page() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return <div className="bg-darkblue shadow-md rounded-2xl p-6 w-full max-w-xl mx-auto  transition-all">
  <h1 className="text-2xl font-semibold text-lightblue mb-2">
    Hello, <span className="text-lightblue capitalize">{user?.name}</span>
  </h1>

  <div className="space-y-1">
    <h2 className="text-lg text-lightblue ">
       Email: <span className="font-medium">{user?.email}</span>
    </h2>
    <h3 className="text-lg text-lightblue not-odd:">
        Score: <span className="font-medium">{user?.score}</span>
    </h3>
  </div>
</div>

}
