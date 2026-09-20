import React, { useEffect, useRef } from "react";

export default function ConstellationBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    let width = 0;
    let height = 0;
    let animationFrame;

    const nodes = [];

    const NODE_COUNT = 75;
    const MAX_DISTANCE = 180;

    // --------------------------------------------------
    // RESIZE CANVAS
    // --------------------------------------------------

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // --------------------------------------------------
    // CREATE CONSTELLATION NODES
    // --------------------------------------------------

    const createNodes = () => {
      nodes.length = 0;

      for (let i = 0; i < NODE_COUNT; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,

          // VERY SLOW MOVEMENT
          vx: (Math.random() - 0.5) * 0.06,
          vy: (Math.random() - 0.5) * 0.06,

          radius: Math.random() * 1.1 + 0.5,

          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: 0.004 + Math.random() * 0.008,
        });
      }
    };

    // --------------------------------------------------
    // DRAW CONSTELLATION
    // --------------------------------------------------

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // ----------------------------------------------
      // SUBTLE ATMOSPHERIC BACKGROUND
      // ----------------------------------------------

      const gradient = ctx.createRadialGradient(
        width * 0.52,
        height * 0.42,
        0,
        width * 0.52,
        height * 0.42,
        Math.max(width, height) * 0.75
      );

      gradient.addColorStop(
        0,
        "rgba(20, 60, 120, 0.055)"
      );

      gradient.addColorStop(
        0.45,
        "rgba(10, 40, 80, 0.025)"
      );

      gradient.addColorStop(
        1,
        "rgba(0, 0, 0, 0)"
      );

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // ----------------------------------------------
      // MOVE NODES
      // ----------------------------------------------

      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        node.pulse += node.pulseSpeed;

        if (node.x < -20) {
          node.x = width + 20;
        }

        if (node.x > width + 20) {
          node.x = -20;
        }

        if (node.y < -20) {
          node.y = height + 20;
        }

        if (node.y > height + 20) {
          node.y = -20;
        }
      });

      // ----------------------------------------------
      // CONSTELLATION CONNECTIONS
      // ----------------------------------------------

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const first = nodes[i];
          const second = nodes[j];

          const dx = first.x - second.x;
          const dy = first.y - second.y;

          const distance = Math.sqrt(
            dx * dx + dy * dy
          );

          if (distance < MAX_DISTANCE) {
            const opacity =
              (1 - distance / MAX_DISTANCE) * 0.16;

            ctx.beginPath();

            ctx.moveTo(
              first.x,
              first.y
            );

            ctx.lineTo(
              second.x,
              second.y
            );

            ctx.strokeStyle = `rgba(
              56,
              189,
              248,
              ${opacity}
            )`;

            ctx.lineWidth = 0.6;

            ctx.stroke();
          }
        }
      }

      // ----------------------------------------------
      // CONSTELLATION NODES
      // ----------------------------------------------

      nodes.forEach((node) => {
        const pulse =
          Math.sin(node.pulse) * 0.25 + 0.75;

        // Very subtle glow
        ctx.beginPath();

        ctx.arc(
          node.x,
          node.y,
          node.radius * 3,
          0,
          Math.PI * 2
        );

        ctx.fillStyle = `rgba(
          14,
          165,
          233,
          ${0.025 * pulse}
        )`;

        ctx.fill();

        // Main tiny node
        ctx.beginPath();

        ctx.arc(
          node.x,
          node.y,
          node.radius,
          0,
          Math.PI * 2
        );

        ctx.fillStyle = `rgba(
          56,
          189,
          248,
          ${0.42 * pulse}
        )`;

        ctx.fill();
      });

      animationFrame =
        requestAnimationFrame(draw);
    };

    // --------------------------------------------------
    // INITIALIZE
    // --------------------------------------------------

    resizeCanvas();
    createNodes();
    draw();

    // --------------------------------------------------
    // RESIZE LISTENER
    // --------------------------------------------------

    const handleResize = () => {
      resizeCanvas();
      createNodes();
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    // --------------------------------------------------
    // CLEANUP
    // --------------------------------------------------

    return () => {
      cancelAnimationFrame(animationFrame);

      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}