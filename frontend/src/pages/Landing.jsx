import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquare, Zap, Shield, Menu, X } from 'lucide-react';

export default function Landing() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const heroRef = useRef(null);

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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', position: 'relative' }}>
      {/* Interactive Network Nodes Canvas */}
      <NetworkCanvas heroRef={heroRef} />

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
          <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
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
        <div style={{ display: 'flex', gap: '40px', marginTop: '80px', flexWrap: 'wrap', justifyContent: 'center' }}>
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

function NetworkCanvas({ heroRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Obstacle bounding box for the hero text
    let obstacle = null;
    const updateObstacle = () => {
      if (heroRef && heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        // Add a comfort margin of 16px around the text box
        const pad = 16;
        obstacle = {
          left: rect.left - pad,
          top: rect.top - pad,
          right: rect.right + pad,
          bottom: rect.bottom + pad,
        };
      } else {
        obstacle = null;
      }
    };
    updateObstacle();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      updateObstacle();
      initNodes();
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', updateObstacle, { passive: true });

    // Mouse tracker
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 70, // Repulsion influence radius
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleMouseLeave);

    // Particle nodes setup
    let nodes = [];
    const initNodes = () => {
      nodes = [];
      // Dynamic count based on screen area
      const nodeCount = Math.floor(Math.min(300, Math.max(50, (width * height) / 5000)));

      for (let i = 0; i < nodeCount; i++) {
        let spawnX = Math.random() * width;
        let spawnY = Math.random() * height;

        // If spawn lands inside obstacle, push it outside
        if (obstacle && spawnX >= obstacle.left && spawnX <= obstacle.right && spawnY >= obstacle.top && spawnY <= obstacle.bottom) {
          if (Math.random() > 0.5) {
            spawnY = Math.random() > 0.5 ? Math.max(0, obstacle.top - 20) : Math.min(height, obstacle.bottom + 20);
          } else {
            spawnX = Math.random() > 0.5 ? Math.max(0, obstacle.left - 20) : Math.min(width, obstacle.right + 20);
          }
        }

        nodes.push({
          x: spawnX,
          y: spawnY,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          radius: Math.random() * 3 + 3.5,
          baseColor: Math.random() > 0.4 ? 'rgba(99, 102, 241,' : 'rgba(139, 92, 246,', // Indigo or violet
          opacity: Math.random() * 0.5 + 0.3,
        });
      }
    };
    initNodes();

    let frameCount = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Periodically update obstacle rect in case of dynamic DOM shifts
      frameCount++;
      if (frameCount % 60 === 0) {
        updateObstacle();
      }

      const maxConnectionDist = 130;
      const maxDistSq = maxConnectionDist * maxConnectionDist;
      const repulsionRadiusSq = mouse.radius * mouse.radius;
      const nodeRepelDist = 35;
      const nodeRepelDistSq = nodeRepelDist * nodeRepelDist;

      // 1. Inter-node repulsion & mutual interaction
      for (let i = 0; i < nodes.length; i++) {
        const nodeA = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const nodeB = nodes[j];
          const cdx = nodeA.x - nodeB.x;
          const cdy = nodeA.y - nodeB.y;
          const cDistSq = cdx * cdx + cdy * cdy;

          // Mutual node repulsion when closer than 42px
          if (cDistSq < nodeRepelDistSq && cDistSq > 0) {
            const dist = Math.sqrt(cDistSq);
            const repelForce = (nodeRepelDist - dist) / nodeRepelDist; // 0 to 1
            const nx = cdx / dist;
            const ny = cdy / dist;
            const push = repelForce * 0.45;

            nodeA.vx += nx * push;
            nodeA.vy += ny * push;
            nodeB.vx -= nx * push;
            nodeB.vy -= ny * push;
          }

          // Connect lines between nearby nodes
          if (cDistSq < maxDistSq) {
            const alpha = (1 - Math.sqrt(cDistSq) / maxConnectionDist) * 0.35;
            ctx.beginPath();
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // 2. Individual node movement, mouse repulsion, and obstacle boundary collisions
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        // Cursor repulsion physics
        const dx = node.x - mouse.x;
        const dy = node.y - mouse.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < repulsionRadiusSq && distSq > 0) {
          const dist = Math.sqrt(distSq);
          const force = (mouse.radius - dist) / mouse.radius;
          const normalX = dx / dist;
          const normalY = dy / dist;

          node.x += normalX * force * 5.5;
          node.y += normalY * force * 5.5;
          node.vx += normalX * force * 0.3;
          node.vy += normalY * force * 0.3;
        }

        // Apply velocities with damping
        node.x += node.vx;
        node.y += node.vy;
        node.vx *= 0.985;
        node.vy *= 0.985;

        // Keep idle drift active
        if (Math.abs(node.vx) < 0.08) node.vx += (Math.random() - 0.5) * 0.08;
        if (Math.abs(node.vy) < 0.08) node.vy += (Math.random() - 0.5) * 0.08;

        // --- Text Area Obstacle Boundary Check ---
        if (obstacle) {
          const r = node.radius;
          if (
            node.x + r >= obstacle.left &&
            node.x - r <= obstacle.right &&
            node.y + r >= obstacle.top &&
            node.y - r <= obstacle.bottom
          ) {
            // Find distance to each edge to determine closest side for clean bounce/deflection
            const dLeft = Math.abs(node.x - obstacle.left);
            const dRight = Math.abs(obstacle.right - node.x);
            const dTop = Math.abs(node.y - obstacle.top);
            const dBottom = Math.abs(obstacle.bottom - node.y);
            const minDist = Math.min(dLeft, dRight, dTop, dBottom);

            if (minDist === dLeft) {
              node.x = obstacle.left - r;
              node.vx = -Math.abs(node.vx) * 0.85 - 0.2;
            } else if (minDist === dRight) {
              node.x = obstacle.right + r;
              node.vx = Math.abs(node.vx) * 0.85 + 0.2;
            } else if (minDist === dTop) {
              node.y = obstacle.top - r;
              node.vy = -Math.abs(node.vy) * 0.85 - 0.2;
            } else {
              node.y = obstacle.bottom + r;
              node.vy = Math.abs(node.vy) * 0.85 + 0.2;
            }
          }
        }

        // Viewport canvas boundary bounce
        if (node.x < 0) {
          node.x = 0;
          node.vx *= -1;
        } else if (node.x > width) {
          node.x = width;
          node.vx *= -1;
        }

        if (node.y < 0) {
          node.y = 0;
          node.vy *= -1;
        } else if (node.y > height) {
          node.y = height;
          node.vy *= -1;
        }

        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${node.baseColor} ${node.opacity})`;
        ctx.shadowColor = 'rgba(99, 102, 241, 0.6)';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', updateObstacle);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseLeave);
    };
  }, [heroRef]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="feature-card" style={{ backgroundColor: 'var(--popup-bg)', border: '1px solid var(--border)', borderRadius: '16px', padding: '30px', width: '300px', textAlign: 'left', position: 'relative', zIndex: 10 }}>
      <div style={{ marginBottom: '20px' }}>{icon}</div>
      <h3 style={{ fontSize: '1.2rem', margin: '0 0 10px 0', color: 'var(--text-main)' }}>{title}</h3>
      <p style={{ color: 'var(--text-muted)', margin: 0, lineHeight: '1.5' }}>{description}</p>
    </div>
  );
}
