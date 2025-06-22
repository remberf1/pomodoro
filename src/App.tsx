import { useState, useEffect, useMemo, } from 'react'
import { Navbar } from './Nav'
import './App.css'

import {WorkCountdownTimer} from './Work'
import  {ShortCountdownTimer} from './short'
import {LongCountdownTimer} from './long'


function RenderTimesList({ activeTab, setActiveTab, timers }) {
  const tabs = ['Work session', 'Short Break', 'Long Break'];
  useEffect(() => {
    if (activeTab) {
      document.title = timers.find(timer => timer.title === activeTab)?.title ?? 'Work session';
    }
  },[activeTab, timers]);  // Only re-run when activeTab or timers change
  
 useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Tab") {
        event.preventDefault(); // prevent default tab focus shifting
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
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setActiveTab]);

  return (
    <div className=" max-w-md mx-auto">
      {/* Tab Bar */}
          <div className="flex">
  {timers.map((timer) => (
    <button
      key={timer.id}
      onClick={() => setActiveTab(timer.title)}
      className={`flex text-center py-2 px-4 transition-all duration-200 rounded-sm font-medium focus:outline-none
        ${
          activeTab === timer.title
            ? 'bg-indigo-200 text-indigo-900 shadow-inner'
            : ' text-white hover:bg-indigo-200'
        }`}
    >
              {timer.title}
            </button>
          ))}
        </div>
    </div>
  );
}


function App() {
const [workcounter, setWorkCounter] = useState(0);

const [activeTab, setActiveTab] = useState('Work session');
useEffect(() => {
  if (workcounter > 0 && workcounter % 4===0 ){
    setActiveTab('Long Break');
  }
}, [workcounter]);
 const [work, setWork] = useState(()=>{
  const savedWork = localStorage.getItem('work');
  return savedWork ? JSON.parse(savedWork) : 25;
 });
  const [short, setShort] = useState(()=>{
    const savedShort = localStorage.getItem('short');
    return savedShort ? JSON.parse(savedShort) : 5;
  });
  const [long, setLong] = useState(()=>{
    const savedLong = localStorage.getItem('long');
    return savedLong ? JSON.parse(savedLong) : 15;
  });

  useEffect(() => {
    localStorage.setItem('work', JSON.stringify(work));
    localStorage.setItem('short', JSON.stringify(short));
    localStorage.setItem('long', JSON.stringify(long));
  }, [work, short, long]);


  const milliseconds=  60 * 1000;

   const timers = useMemo(() => [
    { id: 0, title: 'Work session',
    },
    { id: 1, title: 'Long Break',
    },
    { id: 2, title: 'Short Break',
    },
  ], []);

  return (
    <>
    <Navbar 
        work={work} setWork={setWork} 
        short={short} setShort={setShort} 
        long={long} setLong={setLong} 
      />

    <div className="  grid place-items-center">
      <RenderTimesList
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        timers={timers}
      />
          {activeTab === 'Work session' && (
      <WorkCountdownTimer 
        key={`work-${work}`} 
        duration={work * milliseconds} 
        onCounterChange={setWorkCounter}
      />
    )}
    {activeTab === 'Short Break' && (
      <ShortCountdownTimer 
        key={`short-${short}`} 
        duration={short * milliseconds} 
      />
    )}
    {activeTab === 'Long Break' && (
      <LongCountdownTimer 
        key={`long-${long}`} 
        duration={long * milliseconds} 
      />
    )}

    </div>
    </>
  )

}

export default App
