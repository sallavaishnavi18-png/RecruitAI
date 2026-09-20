import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Cpu } from 'lucide-react';

// 7 Evidence Nodes placed in equidistant angular sectors to guarantee zero collisions
const EVIDENCE_NODES = [
  { id: "RESUME", label: "RESUME", tag: "Parsed & Verified", color: "#38bdf8", sectorIndex: 0, yElevation: 0.25 },
  { id: "SKILLS", label: "SKILLS", tag: "6 Validated • 1 Gap", color: "#818cf8", sectorIndex: 1, yElevation: 0.55 },
  { id: "PROJECTS", label: "PROJECTS", tag: "2 Production Repos", color: "#06b6d4", sectorIndex: 2, yElevation: 0.1 },
  { id: "EXPERIENCE", label: "EXPERIENCE", tag: "2.8 Years Verified", color: "#10b981", sectorIndex: 3, yElevation: -0.45 },
  { id: "INTERVIEW", label: "INTERVIEW", tag: "Transcript Linked", color: "#c084fc", sectorIndex: 4, yElevation: -0.3 },
  { id: "REQUIREMENTS", label: "REQUIREMENTS", tag: "92% Job Match", color: "#38bdf8", sectorIndex: 5, yElevation: 0.4 },
  { id: "INSIGHTS", label: "INSIGHTS", tag: "Recruiter Advisory", color: "#fbbf24", sectorIndex: 6, yElevation: -0.5 }
];

export default function IntelligenceCore3D({ onSelectNode }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [projectedPositions, setProjectedPositions] = useState([]);
  const [activeHoverNode, setActiveHoverNode] = useState(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let animationFrameId;
    let width = container.clientWidth;
    let height = container.clientHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 1000);
    camera.position.z = 7.5;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lights - Soft, focused illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.PointLight(0x38bdf8, 3.2, 25);
    keyLight.position.set(4, 3, 5);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0x6366f1, 2.0, 25);
    fillLight.position.set(-4, -3, 3);
    scene.add(fillLight);

    const coreLight = new THREE.PointLight(0x06b6d4, 3.5, 6);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    // Group for subtle mouse parallax
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // 1. Central Core: Clean Sphere with Triangular Geometry
    // Inner Solid Dark Sphere
    const innerGeo = new THREE.SphereGeometry(1.05, 32, 32);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x070d1e,
      roughness: 0.2,
      metalness: 0.85,
      emissive: 0x0a2244,
      emissiveIntensity: 0.7
    });
    const innerSphere = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerSphere);

    // Triangular Geometry Outer Shell: Clean Wireframe Icosahedron (subdivision 1 for clean triangular facets)
    const icosaGeo = new THREE.IcosahedronGeometry(1.42, 1);
    const icosaMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.45
    });
    const icosahedronMesh = new THREE.Mesh(icosaGeo, icosaMat);
    coreGroup.add(icosahedronMesh);

    // Second refined triangular lattice ring
    const latticeGeo = new THREE.IcosahedronGeometry(1.68, 0);
    const latticeMat = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    });
    const latticeMesh = new THREE.Mesh(latticeGeo, latticeMat);
    coreGroup.add(latticeMesh);

    // Clean single orbital equatorial filament ring
    const ringGeo = new THREE.TorusGeometry(2.0, 0.008, 16, 120);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.35
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.6;
    coreGroup.add(ring);

    // 2. Clean connecting lines from center to each orbiting node (NO background particle clutter)
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending
    });

    const lines = EVIDENCE_NODES.map(() => {
      const geom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, 0)
      ]);
      const line = new THREE.Line(geom, lineMat);
      coreGroup.add(line);
      return line;
    });

    // Mouse Parallax - very subtle, non-disorienting
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / width - 0.5;
      const y = (e.clientY - rect.top) / height - 0.5;
      mouseX = x * 2;
      mouseY = y * 2;
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
    const orbitRadius = 3.25;
    const totalSectors = EVIDENCE_NODES.length;
    const sectorAngle = (Math.PI * 2) / totalSectors;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Slow, intentional core rotation
      innerSphere.rotation.y = elapsedTime * 0.12;
      icosahedronMesh.rotation.y = -elapsedTime * 0.15;
      icosahedronMesh.rotation.x = Math.sin(elapsedTime * 0.25) * 0.12;
      latticeMesh.rotation.z = elapsedTime * 0.08;
      latticeMesh.rotation.y = elapsedTime * 0.1;
      ring.rotation.z = -elapsedTime * 0.06;

      // Subtle mouse lerp
      targetRotationY = mouseX * 0.18;
      targetRotationX = mouseY * 0.12;
      coreGroup.rotation.y += (targetRotationY - coreGroup.rotation.y) * 0.04;
      coreGroup.rotation.x += (-targetRotationX - coreGroup.rotation.x) * 0.04;

      // Synchronized, non-overlapping orbital positions
      const currentProjections = [];
      const baseRotationAngle = elapsedTime * 0.07; // Smooth, slow revolution

      EVIDENCE_NODES.forEach((node, idx) => {
        // Equidistant angular distribution ensures zero collision or overlap
        const angle = baseRotationAngle + node.sectorIndex * sectorAngle;
        const x = Math.cos(angle) * orbitRadius;
        const z = Math.sin(angle) * (orbitRadius * 0.65);
        const y = node.yElevation + Math.sin(elapsedTime * 0.6 + node.sectorIndex) * 0.15;

        // Update clean connecting line
        const line = lines[idx];
        const linePoints = [
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(x, y, z)
        ];
        line.geometry.setFromPoints(linePoints);

        // Project into 2D screen coordinates
        const worldPos = new THREE.Vector3(x, y, z);
        worldPos.applyMatrix4(coreGroup.matrixWorld);
        worldPos.project(camera);

        const screenX = (worldPos.x * 0.5 + 0.5) * width;
        const screenY = (-worldPos.y * 0.5 + 0.5) * height;
        const isFacing = worldPos.z < 1.0;

        currentProjections.push({
          ...node,
          x: screenX,
          y: screenY,
          z: worldPos.z,
          visible: isFacing
        });
      });

      setProjectedPositions(currentProjections);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      icosaGeo.dispose();
      icosaMat.dispose();
      latticeGeo.dispose();
      latticeMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[520px] md:h-[580px] select-none overflow-hidden">
      {/* Three.js Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Central Core Hologram Label */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center justify-center text-center z-10">
        <div className="w-14 h-14 rounded-full bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center backdrop-blur-sm shadow-[0_0_25px_rgba(6,182,212,0.3)] mb-1.5">
          <Cpu className="w-7 h-7 text-cyan-400" />
        </div>
        <span className="text-[10px] tracking-[0.25em] font-mono uppercase text-cyan-300 font-semibold bg-slate-950/70 px-2.5 py-0.5 rounded border border-cyan-500/30">
          INTELLIGENCE CORE
        </span>
      </div>

      {/* Clean, Non-Colliding Projected Evidence Badges */}
      {projectedPositions.map((node) => {
        if (!node.visible) return null;
        const isHovered = activeHoverNode === node.id;

        return (
          <div
            key={node.id}
            style={{
              position: 'absolute',
              left: `${node.x}px`,
              top: `${node.y}px`,
              transform: 'translate(-50%, -50%)',
              zIndex: node.z > 0 ? 10 : 20,
              opacity: THREE.MathUtils.clamp(1.15 - node.z * 0.4, 0.45, 1)
            }}
            className="transition-transform duration-100"
          >
            <button
              onClick={() => onSelectNode && onSelectNode(node.id)}
              onMouseEnter={() => setActiveHoverNode(node.id)}
              onMouseLeave={() => setActiveHoverNode(null)}
              className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border transition-all duration-200 cursor-pointer backdrop-blur-xl whitespace-nowrap ${
                isHovered
                  ? 'bg-slate-900/95 border-cyan-400 scale-105 shadow-[0_0_20px_rgba(56,189,248,0.4)]'
                  : 'bg-[#080d1e]/90 border-white/10 hover:border-cyan-400/50'
              }`}
            >
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: node.color, boxShadow: `0 0 8px ${node.color}` }}
              />
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mono font-bold tracking-wider text-slate-100">
                    {node.label}
                  </span>
                  <span className="text-[9px] font-mono px-1 rounded bg-white/5 text-slate-400 border border-white/10">
                    INSPECT
                  </span>
                </div>
                <div className="text-[10px] text-slate-400">
                  {node.tag}
                </div>
              </div>
            </button>
          </div>
        );
      })}

      {/* Subtle bottom gradient for depth integration */}
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#060810] to-transparent pointer-events-none" />
    </div>
  );
}
