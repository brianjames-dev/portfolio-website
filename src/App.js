import React, { useEffect } from 'react';
import Header from './components/Header';
import Home from './components/Home';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import './App.css';

function App() {
  useEffect(() => {
    function adjustHeaderAndNavScale() {
      const availableHeight = window.innerHeight - 60;

      const referenceHeight = 760;
      const minHeaderHeight = 40;
      const maxHeaderHeight = 60;

      const scale = Math.min(1, availableHeight / referenceHeight);

      const headerHeight =
        minHeaderHeight + (maxHeaderHeight - minHeaderHeight) * scale;
      document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
      document.documentElement.style.setProperty('--nav-top', `${headerHeight / 2}px`);

      const navFontSize = 0.85 + 0.15 * scale;
      document.documentElement.style.setProperty(
        '--nav-font-size',
        `${navFontSize}rem`
      );
    }

    adjustHeaderAndNavScale();
    window.addEventListener('resize', adjustHeaderAndNavScale);

    return () => {
      window.removeEventListener('resize', adjustHeaderAndNavScale);
    };
  }, []);


  return (
    <div className="App">
      <Header />
      <main>
        <Home />
        <About />
        <Projects />
        <Contact />
      </main>
    </div>
  );
}

export default App;
