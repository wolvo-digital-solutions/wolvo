"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Restrained drifting dust — the same bokeh language as the hero frames. */
export function Particles({ count = 220, radius = 6, size = 0.035, color = "#18acfd" }: { count?: number; radius?: number; size?: number; color?: string }) {
  const ref = useRef<THREE.Points>(null);
  // Declarative geometry so R3F disposes it on unmount.
  const positions = useMemo(() => {
    // Seeded so the field is stable between renders (and render stays pure).
    let seed = count * 9301 + 49297;
    const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (rnd() - 0.5) * radius * 2;
      pos[i * 3 + 1] = (rnd() - 0.5) * radius * 1.2;
      pos[i * 3 + 2] = (rnd() - 0.5) * radius;
    }
    return pos;
  }, [count, radius]);

  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.012;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={size} color={color} transparent opacity={0.55} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}
