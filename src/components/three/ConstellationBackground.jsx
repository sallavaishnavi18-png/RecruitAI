import React, { useEffect, useRef } from 'react';

export default function ConstellationBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Subtle pointer parallax coordinates
    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetParallaxX = 0;
    let targetParallaxY = 0;
    let currentParallaxX = 0;
    let currentParallaxY = 0;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      targetParallaxX = (e.clientX - width / 2) * 0.015;
      targetParallaxY = (e.clientY - height / 2) * 0.015;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Modest constellation node count
    const nodeCount = Math.min(42, Math.max(24, Math.floor((width * height) / 45000)));
    const nodes = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      radius: Math.random() * 0.5 + 0.8, // 0.8px - 1.3px
      alpha: Math.random() * 0.12 + 0.12, // 0.12 - 0.24 low opacity
      color: Math.random() > 0.4 ? '#38bdf8' : '#818cf8',
      pulse: Math.random() * Math.PI * 2
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth slow parallax damping
      currentParallaxX += (targetParallaxX - currentParallaxX) * 0.03;
      currentParallaxY += (targetParallaxY - currentParallaxY) * 0.03;

      // Update and draw nodes
      for (let i = 0; i < nodeCount; i++) {
        const n1 = nodes[i];

        if (!prefersReducedMotion) {
          n1.x += n1.vx;
          n1.y += n1.vy;
          n1.pulse += 0.015;

          // Gentle bounce/wrap
          if (n1.x < -20) n1.x = width + 20;
          if (n1.x > width + 20) n1.x = -20;
          if (n1.y < -20) n1.y = height + 20;
          if (n1.y > height + 20) n1.y = -20;
        }

        const renderX = n1.x + currentParallaxX;
        const renderY = n1.y + currentParallaxY;
        const dynamicAlpha = n1.alpha + Math.sin(n1.pulse) * 0.04;

        // Draw small subtle point
        ctx.beginPath();
        ctx.arc(renderX, renderY, n1.radius, 0, Math.PI * 2);
        ctx.fillStyle = n1.color;
        ctx.globalAlpha = Math.max(0.06, dynamicAlpha);
        ctx.fill();

        // Connect nearby nodes with extremely faint filament
        for (let j = i + 1; j < nodeCount; j++) {
          const n2 = nodes[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const distSq = dx * dx + dy * dy;
          const maxDist = 140;

          if (distSq < maxDist * maxDist) {
            const dist = Math.sqrt(distSq);
            const lineAlpha = (1 - dist / maxDist) * 0.055; // max 0.055 opacity (very quiet)

            ctx.beginPath();
            ctx.moveTo(renderX, renderY);
            ctx.lineTo(n2.x + currentParallaxX, n2.y + currentParallaxY);
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 0.6;
            ctx.globalAlpha = lineAlpha;
            ctx.stroke();
          }
        }
      }

      if (!prefersReducedMotion) {
        animId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
}
