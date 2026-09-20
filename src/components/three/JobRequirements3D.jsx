import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { CheckCircle, AlertCircle, HelpCircle, Layers } from 'lucide-react';

const REQ_NODES = [
  { id: "Python", label: "Python", category: "Backend Core", path: "Resume → Project → Validated", status: "validated", color: "#10b981", radius: 2.2, angle: 0 },
  { id: "React", label: "React", category: "Frontend UI", path: "Portfolio → Verified", status: "validated", color: "#10b981", radius: 2.5, angle: (Math.PI * 2) / 6 },
  { id: "SQL", label: "SQL", category: "Data Layer", path: "Postgres Schema → Validated", status: "validated", color: "#10b981", radius: 2.1, angle: (Math.PI * 4) / 6 },
  { id: "AWS", label: "AWS", category: "Cloud Infra", path: "Resume Mention → Evidence Unclear", status: "unclear", color: "#f59e0b", radius: 2.6, angle: (Math.PI * 6) / 6 },
  { id: "System Design", label: "System Design", category: "Architecture", path: "Not Discussed → Probe Required", status: "unclear", color: "#f59e0b", radius: 2.3, angle: (Math.PI * 8) / 6 },
  { id: "Communication", label: "Communication", category: "Soft Skills", path: "Screening Audio → Validated", status: "validated", color: "#10b981", radius: 2.4, angle: (Math.PI * 10) / 6 }
];

export default function JobRequirements3D({ jobTitle = "SENIOR SOFTWARE ENGINEER", onSelectRequirement }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [projectedReqs, setProjectedReqs] = useState([]);
  const [hoveredReq, setHoveredReq] = useState(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let animId;
    let width = container.clientWidth;
    let height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 100);
    camera.position.z = 6.2;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const group = new THREE.Group();
    scene.add(group);

    // Center Job Role Sphere
    const centerGeo = new THREE.OctahedronGeometry(0.85, 2);
    const centerMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      emissive: 0x0369a1,
      emissiveIntensity: 0.8,
      wireframe: true
    });
    const centerMesh = new THREE.Mesh(centerGeo, centerMat);
    group.add(centerMesh);

    const innerCoreGeo = new THREE.SphereGeometry(0.5, 24, 24);
    const innerCoreMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true });
    const innerCore = new THREE.Mesh(innerCoreGeo, innerCoreMat);
    group.add(innerCore);

    // Connecting lines
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.4
    });

    const lines = REQ_NODES.map(() => {
      const geom = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0)]);
      const line = new THREE.Line(geom, lineMat);
      group.add(line);
      return line;
    });

    // Particle field
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(200 * 3);
    for (let i = 0; i < 200 * 3; i += 3) {
      pPos[i] = (Math.random() - 0.5) * 8;
      pPos[i + 1] = (Math.random() - 0.5) * 6;
      pPos[i + 2] = (Math.random() - 0.5) * 4;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMesh = new THREE.Points(pGeo, new THREE.PointsMaterial({ size: 0.03, color: 0x06b6d4, opacity: 0.35, transparent: true }));
    group.add(pMesh);

    // Mouse tilt
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / height - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

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
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      group.rotation.y += (mouseX * 0.3 - group.rotation.y) * 0.04;
      group.rotation.x += (-mouseY * 0.2 - group.rotation.x) * 0.04;

      centerMesh.rotation.y = t * 0.15;
      innerCore.rotation.x = -t * 0.25;

      const projections = [];

      REQ_NODES.forEach((node, idx) => {
        const curAngle = node.angle + t * 0.12;
        const x = Math.cos(curAngle) * node.radius;
        const y = Math.sin(curAngle) * (node.radius * 0.7) + Math.sin(t * 0.6 + idx) * 0.2;
        const z = Math.sin(curAngle * 1.2) * 0.5;

        // Line update
        lines[idx].geometry.setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(x, y, z)]);

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

      setProjectedReqs(projections);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[400px] md:h-[480px] overflow-hidden select-none">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Center Role Label */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center z-10 max-w-[200px]">
        <div className="w-12 h-12 rounded-full bg-cyan-950/70 border border-cyan-400/50 flex items-center justify-center mx-auto mb-1.5 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
          <Layers className="w-6 h-6 text-cyan-300 animate-pulse" />
        </div>
        <div className="text-[11px] font-mono tracking-widest text-cyan-300 font-bold uppercase bg-slate-950/80 px-2.5 py-1 rounded border border-cyan-500/30">
          {jobTitle}
        </div>
        <span className="text-[10px] text-slate-400 mt-1 block">TARGET SPEC</span>
      </div>

      {/* Orbiting Requirement Nodes */}
      {projectedReqs.map((req) => {
        const isHovered = hoveredReq === req.id;
        const isValidated = req.status === "validated";

        return (
          <div
            key={req.id}
            style={{
              position: 'absolute',
              left: `${req.x}px`,
              top: `${req.y}px`,
              transform: 'translate(-50%, -50%)',
              zIndex: isHovered ? 35 : 20
            }}
          >
            <button
              onClick={() => onSelectRequirement && onSelectRequirement(req.id)}
              onMouseEnter={() => setHoveredReq(req.id)}
              onMouseLeave={() => setHoveredReq(null)}
              className={`flex items-center gap-2.5 px-3 py-1.5 rounded-full border transition-all duration-200 cursor-pointer backdrop-blur-md ${
                isHovered
                  ? 'bg-slate-900 border-cyan-400 scale-105 shadow-[0_0_20px_rgba(56,189,248,0.4)]'
                  : 'bg-[#0b1024]/90 border-white/10 hover:border-cyan-400/50'
              }`}
            >
              {isValidated ? (
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-400 animate-pulse" />
              )}
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mono font-bold text-slate-100">{req.label}</span>
                  <span
                    className={`text-[9px] font-mono px-1 rounded uppercase ${
                      isValidated ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30' : 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {isValidated ? 'MATCHED' : 'UNCLEAR'}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono tracking-tight">{req.path}</div>
              </div>
            </button>
          </div>
        );
      })}
    </div>
  );
}
