"use client";
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const CRYSTALS = [
  { pos: [0, 0, 0], rot: [0.1, 0, 0.18], scale: [0.9, 2.4, 0.9], color: "#0050f0" },
  { pos: [-1.1, -0.7, -0.3], rot: [0.3, 0.5, -0.5], scale: [0.5, 1.5, 0.5], color: "#0030a8" },
  { pos: [1.15, -0.9, 0.2], rot: [-0.2, 0.2, 0.6], scale: [0.55, 1.3, 0.55], color: "#0890f8" },
  { pos: [0.5, 1.3, -0.6], rot: [0.5, 0.1, 0.9], scale: [0.3, 0.8, 0.3], color: "#0050f0" },
  { pos: [-0.7, 1.1, 0.5], rot: [-0.4, 0.3, -0.8], scale: [0.25, 0.7, 0.25], color: "#1078f8" },
] as const;

function Cluster() {
  const group = useRef<THREE.Group>(null);
  const target = useRef({ x: 0, y: 0 });

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const scroll = typeof window === "undefined" ? 0 : window.scrollY / window.innerHeight;
    // pointer is -1..1 over the canvas
    target.current.x = state.pointer.x;
    target.current.y = state.pointer.y;
    g.rotation.y += dt * 0.35;
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -target.current.y * 0.35 + scroll * 0.9, 4, dt);
    g.position.y = THREE.MathUtils.damp(g.position.y, scroll * -1.2 + Math.sin(state.clock.elapsedTime * 0.8) * 0.08, 5, dt);
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, 1 - Math.min(scroll, 1) * 0.25, 5, dt));
  });

  return (
    <group ref={group}>
      {CRYSTALS.map((c, i) => (
        <mesh key={i} position={c.pos as unknown as THREE.Vector3Tuple} rotation={c.rot as unknown as THREE.Vector3Tuple} scale={c.scale as unknown as THREE.Vector3Tuple}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={c.color} flatShading metalness={0.15} roughness={0.35} emissive={c.color} emissiveIntensity={0.25} />
        </mesh>
      ))}
    </group>
  );
}

export default function Shard() {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 38 }} dpr={[1, 1.75]} gl={{ alpha: true, antialias: true }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 4, 5]} intensity={2.4} />
      <directionalLight position={[-4, -2, 2]} intensity={1.2} color="#4aa8ff" />
      <Cluster />
    </Canvas>
  );
}
