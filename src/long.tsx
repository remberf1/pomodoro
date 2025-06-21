import React, { useState, useEffect, useRef } from "react";

export const LongCountdownTimer = ({ duration }) => {
  const [time, setTime] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const endTimeRef = useRef<number | null>(null); // stores when timer should end

  useEffect(() => {
    if (!isRunning) return;

    // Set end time only if not already set
    if (!endTimeRef.current) {
      endTimeRef.current = Date.now() + time;
    }

    const intervalId = setInterval(() => {
      const remaining = endTimeRef.current! - Date.now();
      if (remaining <= 0) {
        setTime(0);
        setIsRunning(false);
        endTimeRef.current = null;
        clearInterval(intervalId);
      } else {
        setTime(remaining);
      }
    }, 100);

    return () => clearInterval(intervalId);
  }, [isRunning]);

  const handleReset = () => {
    setIsRunning(false);
    setTime(duration);
    endTimeRef.current = null;
  };

  const getFormattedTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");

    return `${minutes}:${seconds}`;
  };

  return (
    <div className="text-9xl h-[20rem] w-[22rem] grid place-items-center">
      <p className="underline underline-offset-7 decoration-[0.2rem] decoration-gray-400">
        {getFormattedTime(time)}
      </p>

      <div className="text-3xl block mt-1.5 space-x-3">
        {!isRunning && time === duration && (
          <button onClick={() => setIsRunning(true)}>Start</button>
        )}

        {!isRunning && time !== duration && time > 0 && (
          <button onClick={() => setIsRunning(true)}>Resume</button>
        )}

        {isRunning && (
          <button onClick={() => setIsRunning(false)}>Pause</button>
        )}

        {time !== duration && (
          <button onClick={handleReset}>
            Reset
          </button>
        )}
      </div>
    </div>
  );
};
