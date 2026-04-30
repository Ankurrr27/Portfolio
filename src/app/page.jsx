'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Home from '../components/Home';
import About from '../components/About';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Education from '../components/Education';
import Responsibilities from '../components/Responsibilities';
import Footer from '../components/Footer';
import Cursor from '../components/Cursor';
import Achievements from '../components/Achievements';
import Gallery from '../components/Gallery';

function getSessionId() {
  if (typeof window === 'undefined') return null;

  const existing = window.localStorage.getItem('portfolio_session_id');
  if (existing) return existing;

  const generated =
    window.crypto?.randomUUID?.() ||
    `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  window.localStorage.setItem('portfolio_session_id', generated);
  return generated;
}

const App = () => {
  const [totalViews, setTotalViews] = useState(0);

  useEffect(() => {
    const trackView = async () => {
      try {
        const response = await fetch('/api/views', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            path: window.location.pathname,
            sessionId: getSessionId(),
          }),
        });

        const payload = await response.json();
        if (typeof payload.totalViews === 'number') {
          setTotalViews(payload.totalViews);
        }
      } catch {
        try {
          const response = await fetch('/api/views');
          const payload = await response.json();
          if (typeof payload.totalViews === 'number') {
            setTotalViews(payload.totalViews);
          }
        } catch {
          setTotalViews(0);
        }
      }
    };

    trackView();
  }, []);

  return (
    <div className="overflow-x-hidden w-full">
      <Navbar />
      <Home totalViews={totalViews} />
      <About />
      <Skills />
      <Projects />
      <Achievements />
      <Gallery />
      <Responsibilities />
      <Education />
      <Footer totalViews={totalViews} />
      <Cursor />
    </div>
  );
};

export default App;
