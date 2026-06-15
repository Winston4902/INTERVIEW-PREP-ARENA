import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-container">
      {/* Ambient background glow */}
      <div className="glow-bg"></div>

      <header className="hero">
        <div className="hero-badge">✨ Version 1.0 is Live</div>
        <h1>Master your tech interview with <span className="text-gradient">AI precision.</span></h1>
        <p>Practice System Design with a real-time AI interviewer, write code in a professional editor, and speak your answers naturally.</p>
        
        <div className="hero-buttons">
          <Link to="/interview" className="btn-primary">Start Mock Interview</Link>
          <Link to="/resume" className="btn-secondary">Resume Analyzer</Link>
        </div>
      </header>

      <section className="features">
        <div className="feature-card">
          <div className="icon-wrapper">🗣️</div>
          <h2>Voice Recognition</h2>
          <p>Speak your answers naturally using the Web Speech API. The AI listens, transcribes, and responds in real-time.</p>
        </div>
        
        <div className="feature-card">
          <div className="icon-wrapper">💻</div>
          <h2>Pro Code Editor</h2>
          <p>Write algorithms in a fully integrated Monaco Editor, the exact same engine that powers VS Code.</p>
        </div>

        <div className="feature-card">
          <div className="icon-wrapper">🧠</div>
          <h2>Adaptive AI</h2>
          <p>Powered by Gemini, the AI doesn't just grade—it asks dynamic follow-ups based on your weak points.</p>
        </div>
      </section>
    </div>
  );
}

export default Home;