import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '20px', borderBottom: '1px solid #333', backgroundColor: 'var(--bg-dark)' }}>
      <h2 style={{ color: '#10b981', margin: 0 }}>PrepArena</h2>
      
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        {/* These 'to' paths must exactly match the 'path' routes in App.jsx */}
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '16px' }}>
          AI Interview
        </Link>
        <Link to="/resume" style={{ color: 'white', textDecoration: 'none', fontSize: '16px' }}>
          Resume Analyzer
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;