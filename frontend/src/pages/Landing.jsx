import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquare, Zap, Shield, Menu, X, Sun, Moon } from 'lucide-react';
import NetworkBackground from '../components/NetworkBackground';

export default function Landing({ theme, setTheme }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [menuOpen, setMenuOpen] = useState(false);
  const [localTheme, setLocalTheme] = useState(() => {
    return theme || (typeof document !== 'undefined' ? (document.documentElement.getAttribute('data-theme') || 'bright') : 'bright');
  });
  const menuRef = useRef(null);
  const heroRef = useRef(null);

  const currentTheme = theme || localTheme;

  const toggleTheme = () => {
    const nextTheme = currentTheme === 'bright' ? 'dark' : 'bright';
    if (setTheme) {
      setTheme(nextTheme);
    }
    setLocalTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('teamorie_theme', nextTheme);
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-dark)', color: 'var(--text-main)', position: 'relative' }}>
      {/* Interactive Network Nodes Canvas */}
      <NetworkBackground obstacleRef={heroRef} />

      {/* Navigation Bar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: isMobile ? '10px 20px' : '10px 40px', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-dark)', position: 'relative', zIndex: 50 }}>
        <div style={{ fontSize: isMobile ? '1.3rem' : '1.8rem', fontWeight: 'bold', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img 
            src="/logo.png" 
            alt="Teamorie Logo" 
            style={{ 
              width: isMobile ? '35px' : '50px', 
              height: isMobile ? '35px' : '50px', 
              objectFit: 'contain' 
            }} 
          />
          Teamorie
        </div>

        {!isMobile ? (
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <button
              onClick={toggleTheme}
              title={currentTheme === 'bright' ? 'Switch to Dark Theme' : 'Switch to Bright Theme'}
              aria-label="Toggle theme"
              style={{
                background: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: '50%',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-main)',
                transition: 'all 0.2s ease',
              }}
              className="hover-bg"
            >
              {currentTheme === 'bright' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <a href="#about" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }} className="hover-text-primary">About</a>
            <a href="#contact" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }} className="hover-text-primary">Contact</a>
            <Link to="/login" className="btn-primary" style={{ padding: '8px 20px', textDecoration: 'none' }}>
              Login
            </Link>
          </div>
        ) : (
          <div ref={menuRef} style={{ display: 'flex', alignItems: 'center' }}>
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>

            {/* Mobile Navigation Popup with smooth fade-in and fade-out */}
            <div 
              style={{
                position: 'absolute',
                top: '100%',
                left: '15px',
                right: '15px',
                marginTop: '10px',
                background: 'var(--popup-bg)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
                zIndex: 200,
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? 'translateY(0) scale(1)' : 'translateY(-10px) scale(0.97)',
                pointerEvents: menuOpen ? 'auto' : 'none',
                transition: 'opacity 0.25s ease, transform 0.25s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', borderBottom: '1px solid var(--border)', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Theme</span>
                <button
                  onClick={toggleTheme}
                  title={currentTheme === 'bright' ? 'Switch to Dark Theme' : 'Switch to Bright Theme'}
                  aria-label="Toggle theme"
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--border)',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--text-main)',
                  }}
                >
                  {currentTheme === 'bright' ? <Moon size={18} /> : <Sun size={18} />}
                </button>
              </div>
              <a 
                href="#about" 
                onClick={() => setMenuOpen(false)}
                style={{ color: 'var(--text-main)', textDecoration: 'none', fontSize: '1.1rem', padding: '10px', borderRadius: '8px' }}
                className="hover-bg"
              >
                About
              </a>
              <a 
                href="#contact" 
                onClick={() => setMenuOpen(false)}
                style={{ color: 'var(--text-main)', textDecoration: 'none', fontSize: '1.1rem', padding: '10px', borderRadius: '8px' }}
                className="hover-bg"
              >
                Contact
              </a>
              <Link 
                to="/login" 
                onClick={() => setMenuOpen(false)}
                className="btn-primary" 
                style={{ textAlign: 'center', textDecoration: 'none', padding: '12px', borderRadius: '8px', marginTop: '6px' }}
              >
                Login
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content (Hero Section) */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '20px' : '40px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div ref={heroRef} style={{ display: 'inline-block', maxWidth: '850px' }}>
          <h1 style={{ fontSize: isMobile ? '2.5rem' : '4rem', fontWeight: 'bold', marginBottom: '20px', lineHeight: '1.2' }}>
            The Smartest Way For Your <br/> <span style={{ color: 'var(--primary)' }}>Team to Collaborate</span>
          </h1>
          <p style={{ fontSize: isMobile ? '1rem' : '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 40px auto', lineHeight: '1.6' }}>
            Teamorie is an AI-powered workspace that actively listens, stores your team's decisions, and fetches memories instantly. Never lose context again.
          </p>
        </div>
        <Link to="/login" className="btn-primary" style={{ fontSize: isMobile ? '1rem' : '1.2rem', padding: isMobile ? '12px 30px' : '15px 40px', display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          Get Started <ArrowRight size={20} />
        </Link>

        {/* Feature Highlights */}
        <div id="about" style={{ display: 'flex', gap: '40px', marginTop: '80px', flexWrap: 'wrap', justifyContent: 'center', scrollMarginTop: '100px' }}>
          <FeatureCard 
            icon={<Zap size={32} color="var(--primary)" />} 
            title="Instant Retrieval" 
            description="Our advanced LLM pipeline fetches your project memories in milliseconds." 
          />
          <FeatureCard 
            icon={<MessageSquare size={32} color="#10b981" />} 
            title="Smart Agent" 
            description="Have a 1-on-1 private chat with the Teamorie Agent to update or query team knowledge." 
          />
          <FeatureCard 
            icon={<Shield size={32} color="#f59e0b" />} 
            title="Total Privacy" 
            description="Toggle AI listening on or off at the click of a button for private conversations." 
          />
        </div>
      </main>

      {/* Footer */}
      <footer id="contact" style={{ padding: '20px', textAlign: 'center', borderTop: '1px solid var(--border)', color: 'var(--text-muted)', position: 'relative', zIndex: 10, backgroundColor: 'var(--bg-dark)' }}>
        <p>&copy; {new Date().getFullYear()} Teamorie. Final Year Project.</p>
        <p style={{ fontSize: '0.9rem', marginTop: '10px' }}>Contact: teamoriesupport@gmail.com</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="feature-card" style={{ backgroundColor: 'var(--popup-bg)', borderRadius: '16px', padding: '30px', width: '300px', textAlign: 'left', position: 'relative', zIndex: 10 }}>
      <div style={{ marginBottom: '20px' }}>{icon}</div>
      <h3 style={{ fontSize: '1.2rem', margin: '0 0 10px 0', color: 'var(--text-main)' }}>{title}</h3>
      <p style={{ color: 'var(--text-muted)', margin: 0, lineHeight: '1.5' }}>{description}</p>
    </div>
  );
}
