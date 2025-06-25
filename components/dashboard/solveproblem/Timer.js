'use client'
import React, { useEffect, useRef, useState } from 'react';

export default function Timer({ settimetaken, restarttime, stopclock }) {
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const intervalRef = useRef(null);
  const prevRestart = useRef(false);
  const prevStop = useRef(false);

  useEffect(() => {
    startTimer();
    return () => clearInterval(intervalRef.current); // Cleanup
  }, []);

  // ⏱️ Restart if requested
  useEffect(() => {
    if (restarttime && !prevRestart.current) {
      prevRestart.current = true;
      stopAndReport(); // Stop and report previous session
      setSecondsElapsed(0); // Reset
      startTimer(); // Start fresh
    }
    if (!restarttime) {
      prevRestart.current = false;
    }
  }, [restarttime]);

  // ❌ Stop if requested
  useEffect(() => {
    if (stopclock && !prevStop.current) {
      prevStop.current = true;
      stopAndReport();
    }
    if (!stopclock) {
      prevStop.current = false;
    }
  }, [stopclock]);

  const startTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
  };

  const stopAndReport = () => {
    clearInterval(intervalRef.current);
    const minutes = Math.floor(secondsElapsed / 60);
    const seconds = secondsElapsed % 60;
    const timeDecimal = Number((minutes + seconds / 60).toFixed(2));
    settimetaken(timeDecimal);
  };

  const minutes = Math.floor(secondsElapsed / 60);
  const seconds = secondsElapsed % 60;

  return (
    <div className="p-2 bg-gray-100 rounded shadow inline-flex items-center gap-2">
      <span className="font-mono text-lg">
        ⏱️ {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
}
