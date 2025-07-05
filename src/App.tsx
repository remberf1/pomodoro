import { useState, useEffect, useMemo } from "react";
import { Navbar } from "./Nav";
import { CountdownTimer } from "./CountDownTimer";
import "./App.css";

// Define types for props
type Timer = {
  id: number;
  title: string;
};

type RenderTimesListProps = {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  timers: Timer[];
};

// RenderTimesList component
function RenderTimesList({ activeTab, setActiveTab, timers }: RenderTimesListProps) {
  const tabs = ['Work session', 'Short Break', 'Long Break'];

  useEffect(() => {
    if (activeTab) {
      document.title = timers.find(timer => timer.title === activeTab)?.title ?? 'Work session';
    }
  }, [activeTab, timers]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Tab") {
        event.preventDefault();
        setActiveTab(prev => {
          const currentIndex = tabs.indexOf(prev);
          return tabs[(currentIndex + 1) % tabs.length];
        });
      }
      if (event.key === "1") setActiveTab('Work session');
      if (event.key === "2") setActiveTab('Long Break');
      if (event.key === "3") setActiveTab('Short Break');
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setActiveTab]);

  return (
    <div className="max-w-md mx-auto">
      <div className="flex">
        {timers.map((timer) => (
          <button
            key={timer.id}
            onClick={() => setActiveTab(timer.title)}
            className={`flex text-center py-2 px-4 transition-all duration-200 rounded-sm font-medium focus:outline-none
              ${
                activeTab === timer.title
                  ? "bg-indigo-200 text-indigo-900 shadow-inner"
                  : "text-white hover:bg-indigo-200"
              }`}
          >
            {timer.title}
          </button>
        ))}
      </div>
    </div>
  );
}

// Main App component
function App() {
  const [workCounter, setWorkCounter] = useState<number>(0); // Explicit number type
  const [activeTab, setActiveTab] = useState<string>('Work session'); // Explicit string type

  useEffect(() => {
    if (workCounter > 0 && workCounter % 4 === 0) {
      setActiveTab('Long Break');
    }
  }, [workCounter]);

  const [work, setWork] = useState<number>(() => {
    const saved = localStorage.getItem('work');
    return saved ? JSON.parse(saved) : 25;
  });

  const [short, setShort] = useState<number>(() => {
    const saved = localStorage.getItem('short');
    return saved ? JSON.parse(saved) : 5;
  });

  const [long, setLong] = useState<number>(() => {
    const saved = localStorage.getItem('long');
    return saved ? JSON.parse(saved) : 15;
  });

  useEffect(() => {
    localStorage.setItem('work', JSON.stringify(work));
    localStorage.setItem('short', JSON.stringify(short));
    localStorage.setItem('long', JSON.stringify(long));
  }, [work, short, long]);

  const milliseconds = 60 * 1000;

  const timers = useMemo(() => [
    { id: 0, title: 'Work session' },
    { id: 1, title: 'Long Break' },
    { id: 2, title: 'Short Break' },
  ], []);

  return (
    <>
      <Navbar 
        work={work} setWork={setWork} 
        short={short} setShort={setShort} 
        long={long} setLong={setLong} 
      />

      <div className="grid place-items-center">
        <RenderTimesList
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          timers={timers}
        />

        {activeTab === 'Work session' && (
          <CountdownTimer
            key={`work-${work}`}
            duration={work * milliseconds}
            title="Work session"
            progressBarColor="bg-red-300"
            showCounter
            keyboardControl
            onCounterChange={setWorkCounter}
            storageKey="work-counter"
          />
        )}

        {activeTab === 'Short Break' && (
          <CountdownTimer
            key={`short-${short}`}
            duration={short * milliseconds}
            title="Short Break"
            progressBarColor="bg-blue-300"
            keyboardControl
            storageKey="short-counter"
          />
        )}

        {activeTab === 'Long Break' && (
          <CountdownTimer
            key={`long-${long}`}
            duration={long * milliseconds}
            title="Long Break"
            progressBarColor="bg-green-300"
            keyboardControl
            storageKey="long-counter"
          />
        )}
      </div>
    </>
  );
}

export default App;
