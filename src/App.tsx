import { useState, useEffect, useMemo, } from 'react'
import { Navbar } from './Nav'
import './App.css'

import {WorkCountdownTimer} from './Work'
import  {ShortCountdownTimer} from './short'
import {LongCountdownTimer} from './long'


function RenderTimesList({ activeTab, setActiveTab, timers }) {
  useEffect(() => {
    if (activeTab) {
      document.title = timers.find(timer => timer.title === activeTab)?.title ?? 'Work session';
    }
  },[activeTab, timers]);  // Only re-run when activeTab or timers change
  
  return (
    <div className=" max-w-md mx-auto">
      {/* Tab Bar */}
      <div className="flex  ">
        {timers.map(timer => (
          <button
          key={timer.id}
          onClick={() => setActiveTab(timer.title)}
          className={`flex text-center py-2 px-4 transition-all duration-200
            ${
              activeTab === timer.title
              ? 'bg-indigo-800 rounded-sm  font-semibold'
              : ' hover:text-indigo-600 bg-transparent'
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

 const [work, setWork] = useState(25);
  const [short, setShort] = useState(5);
  const [long, setLong] = useState(15);

  const [activeTab, setActiveTab] = useState('Work session');

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

    <div className="bg-indigo-600  grid place-items-center">
      <RenderTimesList
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        timers={timers}
      />
          {activeTab === 'Work session' && (
      <WorkCountdownTimer 
        key={`work-${work}`} 
        duration={work * 60 * 1000} 
      />
    )}
    {activeTab === 'Short Break' && (
      <ShortCountdownTimer 
        key={`short-${short}`} 
        duration={short * 60 * 1000} 
      />
    )}
    {activeTab === 'Long Break' && (
      <LongCountdownTimer 
        key={`long-${long}`} 
        duration={long * 60 * 1000} 
      />
    )}

    </div>
    </>
  )

}

export default App
