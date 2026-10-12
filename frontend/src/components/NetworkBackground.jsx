import { useEffect, useRef } from 'react';

export default function NetworkBackground({ obstacleRef = null }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Obstacle bounding box
    let obstacle = null;
    const updateObstacle = () => {
      if (obstacleRef && obstacleRef.current) {
        const rect = obstacleRef.current.getBoundingClientRect();
        // Comfort margin of 16px around the obstacle
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
      const nodeCount = Math.floor(Math.min(350, Math.max(50, (width * height) / 5000)));

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

          // Mutual node repulsion when closer than 35px
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

        // --- Obstacle Boundary Check ---
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
  }, [obstacleRef]);

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
