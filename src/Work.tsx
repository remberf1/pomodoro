import React, { useState, useEffect, useRef } from "react";

type WorkCountdownTimerProps = {
  duration: number;
  onCounterChange?: (counter: number) => void;
};

export const WorkCountdownTimer: React.FC<WorkCountdownTimerProps> = ({
  duration,
  onCounterChange,
}) => {
  const [time, setTime] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const [counter, setCounter] = useState(() => {
    const savedCounter = localStorage.getItem("counter");
    return savedCounter ? JSON.parse(savedCounter) : 0;
  });

  const endTimeRef = useRef<number | null>(null);

  // Sync time when duration changes (e.g., switching tab)
  useEffect(() => {
    setTime(duration);
    setIsRunning(false);
    endTimeRef.current = null;
  }, [duration]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        setIsRunning((prev) => {
          if (time > 0) return !prev;
          return prev;
        });
      }
      if (event.key.toLowerCase() === "r") {
        setIsRunning(false);
        setTime(duration);
        endTimeRef.current = null;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [time, duration]);

  // Main countdown effect
  useEffect(() => {
    if (!isRunning || time === 0) return;

    // Set endTimeRef when starting/resuming
    endTimeRef.current = Date.now() + time;

    const intervalId = setInterval(() => {
      const remaining = endTimeRef.current! - Date.now();

      const timeUp = new Audio("/sounds/Alarm-Clock-Short-chosic.com_.mp3");

      if (remaining <= 0) {
        setTime(0);
        timeUp.play();
        setTimeout(() => {
          timeUp.pause();
          timeUp.currentTime = 0;
        }, 3000);
        const newCounter = counter + 1;
        setCounter(newCounter);
        localStorage.setItem("counter", JSON.stringify(newCounter));
        if (onCounterChange) {
          onCounterChange(newCounter);
        }
        setIsRunning(false);
        endTimeRef.current = null;
        clearInterval(intervalId);
      } else {
        setTime(remaining);
      }
    }, 100);

    return () => clearInterval(intervalId);
  }, [isRunning, counter]);

  const handleReset = () => {
    setIsRunning(false);
    setTime(duration);
    endTimeRef.current = null;
  };

  const clearLocalStorage = () => {
    localStorage.removeItem("counter");
    setCounter(0);
  };

  useEffect(() => {
    const totalSeconds = Math.floor(time / 1000);
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");
    const formatted = `${minutes}:${seconds}`;

    if (time > 0) {
      document.title = `${formatted} - Work Timer`;
    } else {
      document.title = "Time's up! 🔔";
    }

    // Optional cleanup: reset title when component unmounts
    return () => {
      document.title = "Work session"; // or your default app title
    };
  }, [time]);

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
        <p
          className="underline underline-offset-7 decoration-[0.2rem] decoration-gray-400"
          aria-live="polite"
          aria-atomic="true"
          role="timer"
        >
          {getFormattedTime(time)}
        </p>

        <div className="text-3xl block mt-1.5 space-x-3">
          {isRunning && (
            <button className="bg-indigo-200 text-indigo-900 shadow-inner px-2 py-1 rounded-md transition-colors duration-200 hover:cursor-pointer hover:bg-indigo-300 hover:text-indigo-900 active:bg-indigo-400" onClick={() => setIsRunning(false)} aria-label="Pause timer">
              Pause
            </button>
          )}

          {!isRunning && time === duration && time > 0 && (
            <button className="bg-indigo-200 text-indigo-900 shadow-inner px-2 py-1 rounded-md transition-colors duration-200 hover:cursor-pointer hover:bg-indigo-300 hover:text-indigo-900 active:bg-indigo-400
"              onClick={() => setIsRunning(true)} aria-label="Start timer">
              Start
            </button>
          )}

          {!isRunning && time !== duration && time > 0 && (
            <button className="bg-indigo-200 text-indigo-900 shadow-inner px-2 py-1 rounded-md transition-colors duration-200 hover:cursor-pointer hover:bg-indigo-300 hover:text-indigo-900 active:bg-indigo-400" onClick={() => setIsRunning(true)} aria-label="Resume timer">
              Resume
            </button>
          )}

          {!isRunning && time === 0 && (
            <button className="bg-indigo-200 text-indigo-900 shadow-inner px-2 py-1 rounded-md transition-colors duration-200 hover:cursor-pointer hover:bg-indigo-300 hover:text-indigo-900 active:bg-indigo-400" onClick={handleReset} aria-label="Reset timer">
              Reset
            </button>
          )}

          {time !== duration && time > 0 && (
            <button className="bg-indigo-200 text-indigo-900 shadow-inner px-2 py-1 rounded-md transition-colors duration-200 hover:cursor-pointer hover:bg-indigo-300 hover:text-indigo-900 active:bg-indigo-400" onClick={handleReset} aria-label="Reset timer">
              Reset
            </button>
          )}
        </div>

        <div className="flex items-center mt-3 text-3xl space-x-3">
          <span>Work counter: {counter}</span>
          {counter > 0 && (
            <button
              className="bg-indigo-200 text-indigo-900 shadow-inner px-2 py-1 rounded-md transition-colors duration-200 hover:cursor-pointer hover:bg-indigo-300 hover:text-indigo-900 active:bg-indigo-400"
              onClick={clearLocalStorage}
              aria-label="Reset work counter"
            >
              Reset Counter
            </button>
          )}
        </div>
    </div>
  );
};
