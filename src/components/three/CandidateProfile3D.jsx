import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { User, FileText, Code, GitBranch, MessageSquare, CheckCircle, AlertTriangle } from 'lucide-react';

const SATELLITE_NODES = [
  { id: "RESUME", label: "RESUME", status: "Verified", icon: FileText, color: "#38bdf8", angle: 0, radius: 2.3 },
  { id: "PROJECTS", label: "PROJECTS", status: "2 Validated", icon: Code, color: "#818cf8", angle: (Math.PI * 2) / 6, radius: 2.45 },
  { id: "SKILLS", label: "SKILLS", status: "Python • React", icon: CheckCircle, color: "#10b981", angle: (Math.PI * 4) / 6, radius: 2.3 },
  { id: "GITHUB", label: "GITHUB", status: "18 Repos", icon: GitBranch, color: "#06b6d4", angle: (Math.PI * 6) / 6, radius: 2.4 },
  { id: "INTERVIEW", label: "INTERVIEW", status: "Transcribed", icon: MessageSquare, color: "#c084fc", angle: (Math.PI * 8) / 6, radius: 2.3 },
  { id: "REQUIREMENTS", label: "REQUIREMENTS", status: "92% Fit", icon: AlertTriangle, color: "#fbbf24", angle: (Math.PI * 10) / 6, radius: 2.45 }
];

export default function CandidateProfile3D({ candidate, onSelectEvidence }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [projectedNodes, setProjectedNodes] = useState([]);
  const [activeHoverNode, setActiveHoverNode] = useState(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let animationFrameId;
    let width = container.clientWidth;
    let height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 5.8;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const group = new THREE.Group();
    scene.add(group);

    // Center avatar core
    const centerGeo = new THREE.SphereGeometry(0.55, 32, 32);
    const centerMat = new THREE.MeshStandardMaterial({
      color: 0x0c142b,
      emissive: 0x0284c7,
      emissiveIntensity: 0.5,
      metalness: 0.8,
      roughness: 0.2
    });
    const centerMesh = new THREE.Mesh(centerGeo, centerMat);
    group.add(centerMesh);

    // Clean outer geometric wireframe ring
    const haloGeo = new THREE.RingGeometry(0.72, 0.76, 40);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    group.add(haloMesh);

    // Connecting lines from center to each satellite
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending
    });

    const lines = SATELLITE_NODES.map(() => {
      const geom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, 0)
      ]);
      const line = new THREE.Line(geom, lineMat);
      group.add(line);
      return line;
    });

    // Mouse tracking - SUBTLE PARALLAX with smooth damping
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / height - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // REDUCED ROTATION: Much smaller range, gentle slow damping (subtle parallax)
      const targetRotY = mouseX * 0.08;
      const targetRotX = -mouseY * 0.05;
      group.rotation.y += (targetRotY - group.rotation.y) * 0.025;
      group.rotation.x += (targetRotX - group.rotation.x) * 0.025;

      centerMesh.rotation.y = t * 0.12;
      haloMesh.rotation.z = -t * 0.18;

      // Stable, calm satellite orbital sway
      const projections = [];

      SATELLITE_NODES.forEach((node, idx) => {
        const currentAngle = node.angle + t * 0.08; // Slower, calmer revolution
        const x = Math.cos(currentAngle) * node.radius;
        const y = Math.sin(currentAngle) * (node.radius * 0.6);
        const z = Math.sin(currentAngle * 0.8) * 0.12; // Minimal z-axis displacement for stable readability

        // update connecting line
        const line = lines[idx];
        line.geometry.setFromPoints([
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(x, y, z)
        ]);

        // project to 2D
        const worldPos = new THREE.Vector3(x, y, z);
        worldPos.applyMatrix4(group.matrixWorld);
        worldPos.project(camera);

        const screenX = (worldPos.x * 0.5 + 0.5) * width;
        const screenY = (-worldPos.y * 0.5 + 0.5) * height;

        projections.push({
          ...node,
          x: screenX,
          y: screenY,
          z: worldPos.z
        });
      });

      setProjectedNodes(projections);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[380px] md:h-[450px] overflow-hidden select-none">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Central Candidate Node */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none z-20">
        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-600 p-[2px] shadow-[0_0_25px_rgba(56,189,248,0.4)]">
          <div className="w-full h-full rounded-full bg-[#070b19] flex items-center justify-center font-bold text-white tracking-wider text-sm border border-white/20">
            {candidate?.avatar || "RS"}
          </div>
        </div>
        <span className="mt-2 text-xs font-mono font-bold tracking-widest text-white uppercase bg-slate-900/80 px-2 py-0.5 rounded border border-cyan-500/30">
          {candidate?.name?.split(" ")[0]?.toUpperCase() || "CANDIDATE"}
        </span>
      </div>

      {/* Interactive Orbiting Satellites */}
      {projectedNodes.map((node) => {
        const IconComponent = node.icon;
        const isHovered = activeHoverNode === node.id;

        return (
          <div
            key={node.id}
            style={{
              position: 'absolute',
              left: `${node.x}px`,
              top: `${node.y}px`,
              transform: 'translate(-50%, -50%)',
              zIndex: isHovered ? 30 : 25
            }}
          >
            <button
              onClick={() => onSelectEvidence && onSelectEvidence(node.id)}
              onMouseEnter={() => setActiveHoverNode(node.id)}
              onMouseLeave={() => setActiveHoverNode(null)}
              className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-all duration-200 cursor-pointer backdrop-blur-md whitespace-nowrap ${
                isHovered
                  ? 'bg-slate-900 border-cyan-400 scale-105 shadow-[0_0_20px_rgba(56,189,248,0.4)]'
                  : 'bg-[#090e21]/90 border-white/10 hover:border-cyan-400/50'
              }`}
            >
              <IconComponent className="w-3.5 h-3.5 shrink-0" style={{ color: node.color }} />
              <div className="text-left">
                <div className="text-[11px] font-mono font-semibold text-slate-100">{node.label}</div>
                <div className="text-[9px] text-slate-400">{node.status}</div>
              </div>
            </button>
          </div>
        );
      })}
    </div>
  );
}
