import React, { useState, useEffect, useRef } from "react";

type CountDownTimerProps = {
  duration: number;
  title?: string;
  progressBarColor?: string;
  onCounterChange?: (counter: number) => void;
  showCounter?: boolean;
  keyboardControl?: boolean;
  storageKey?: string; // for unique counter keys
};

export const CountdownTimer: React.FC<CountDownTimerProps> = ({
  duration,
  title = "Timer",
  progressBarColor = "bg-green-200",
  onCounterChange,
  showCounter = false,
  keyboardControl = true,
  storageKey = "counter",
}) => {
  const [time, setTime] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const [filled, setFilled] = useState(0);
  const [counter, setCounter] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : 0;
  });

  const endTimeRef = useRef<number | null>(null);

  useEffect(() => {
    setTime(duration);
    setIsRunning(false);
    endTimeRef.current = null;
  }, [duration]);

  useEffect(() => {
    if (!keyboardControl) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setIsRunning((prev: boolean) => (time > 0 ? !prev : prev)); // Explicit typing for prev
      }
      if (e.key.toLowerCase() === "r") {
        handleReset();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [keyboardControl, time, duration]);

  useEffect(() => {
    if (!isRunning || time === 0) return;

    endTimeRef.current = Date.now() + time;

    const intervalId = setInterval(() => {
      const remaining = endTimeRef.current! - Date.now();
      const audio = new Audio("/sounds/Alarm-Clock-Short-chosic.com_.mp3");

      if (remaining <= 0) {
        setTime(0);
        setFilled(100);
        setIsRunning(false);
        endTimeRef.current = null;
        clearInterval(intervalId);

        audio.play();
        setTimeout(() => {
          audio.pause();
          audio.currentTime = 0;
        }, 3000);

        setCounter((prev:number) => {
          const updated = prev + 1;
          localStorage.setItem(storageKey, JSON.stringify(updated));
          onCounterChange?.(updated);
          return updated;
        });
      } else {
        setTime(remaining);
        setFilled(((duration - remaining) / duration) * 100);
      }
    }, 100);

    return () => clearInterval(intervalId);
  }, [isRunning]);

  const handleReset = () => {
    setIsRunning(false);
    setTime(duration);
    endTimeRef.current = null;
  };

  const clearLocalStorage = () => {
    localStorage.removeItem(storageKey);
    setCounter(0);
  };

  const getFormattedTime = (ms: number) => {
    const total = Math.floor(ms / 1000);
    const minutes = Math.floor(total / 60).toString().padStart(2, "0");
    const seconds = (total % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  useEffect(() => {
    const formatted = getFormattedTime(time);
    document.title = time > 0 ? `${formatted} - ${title}` : "Time's up! 🔔";
    return () => {
      document.title = title;
    };
  }, [time, title]);

  return (
    <div className="text-9xl h-[20rem] w-[22rem] grid place-items-center">
      <p aria-live="polite" role="timer" className="-mb-8">
        {getFormattedTime(time)}
      </p>

      <div className="h-[0.2rem] w-full bg-gray-600">
        <div
          className={`${progressBarColor} h-[0.2rem]`}
          role="progressbar"
          aria-valuenow={filled}
          aria-valuemin={0}
          aria-valuemax={100}
          style={{ width: `${filled}%` }}
        />
      </div>

      <div className="text-3xl mt-1.5 space-x-3">
        {isRunning && (
          <button
            onClick={() => setIsRunning(false)}
            aria-label="Pause timer"
            className="bg-indigo-200 text-indigo-900 shadow-inner px-2 py-1 rounded-md transition-colors duration-200 hover:cursor-pointer hover:bg-indigo-300 hover:text-indigo-900 active:bg-indigo-400"
          >
            Pause
          </button>
        )}

        {!isRunning && time === duration && time > 0 && (
          <button
            onClick={() => setIsRunning(true)}
            aria-label="Start timer"
            className="bg-indigo-200 text-indigo-900 shadow-inner px-2 py-1 rounded-md transition-colors duration-200 hover:cursor-pointer hover:bg-indigo-300 hover:text-indigo-900 active:bg-indigo-400"
          >
            Start
          </button>
        )}

        {!isRunning && time !== duration && time > 0 && (
          <button
            onClick={() => setIsRunning(true)}
            aria-label="Resume timer"
            className="bg-indigo-200 text-indigo-900 shadow-inner px-2 py-1 rounded-md transition-colors duration-200 hover:cursor-pointer hover:bg-indigo-300 hover:text-indigo-900 active:bg-indigo-400"
          >
            Resume
          </button>
        )}

        {(!isRunning && time === 0) || (time !== duration && time > 0) ? (
          <button
            onClick={handleReset}
            aria-label="Reset timer"
            className="bg-indigo-200 text-indigo-900 shadow-inner px-2 py-1 rounded-md transition-colors duration-200 hover:cursor-pointer hover:bg-indigo-300 hover:text-indigo-900 active:bg-indigo-400"
          >
            Reset
          </button>
        ) : null}
      </div>

      {showCounter && (
        <div className="flex items-center mt-3 text-3xl space-x-3">
          <span>
            {title} count: {counter}
          </span>
          {counter > 0 && (
            <button
              onClick={clearLocalStorage}
              aria-label="Reset counter"
              className="bg-indigo-200 text-indigo-900 shadow-inner px-2 py-1 rounded-md transition-colors duration-200 hover:cursor-pointer hover:bg-indigo-300 hover:text-indigo-900 active:bg-indigo-400"
            >
              Reset Counter
            </button>
          )}
        </div>
      )}
    </div>
  );
};
