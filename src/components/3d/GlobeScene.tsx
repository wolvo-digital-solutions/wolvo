"use client";

import { useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { QuadraticBezierLine } from "@react-three/drei";
import * as THREE from "three";
import { Particles } from "./Particles";
import type { Tier } from "@/components/motion/ExperienceProvider";

const R = 1.6;

/** lat/lon (degrees) → point on sphere. Nodes are illustrative, not client locations. */
const toVec = (lat: number, lon: number, r = R) => {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon + 180);
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
};

const nodeCoords: [number, number][] = [
  [20, 78], [51, 0], [40, -74], [1, 104], [25, 55], [-33, 151], [35, 139], [-23, -46], [52, 13], [6, 3], [37, -122],
];
const links: [number, number][] = [
  [0, 1], [0, 4], [0, 3], [1, 2], [3, 6], [3, 5], [4, 8], [2, 7], [1, 9], [2, 10], [6, 10], [0, 8],
];

function DotShell({ count }: { count: number }) {
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const t = golden * i;
      pos.set([Math.cos(t) * r * R * 1.004, y * R * 1.004, Math.sin(t) * r * R * 1.004], i * 3);
    }
    return pos;
  }, [count]);
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#18acfd" transparent opacity={0.7} sizeAttenuation depthWrite={false} />
    </points>
  );
}

const atmosphere = {
  uniforms: { uColor: { value: new THREE.Color("#0d79fd") } },
  vertexShader: /* glsl */ `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,
  fragmentShader: /* glsl */ `
    uniform vec3 uColor;
    varying vec3 vNormal;
    void main() {
      float i = pow(max(0.0, 0.62 - dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.4);
      gl_FragColor = vec4(uColor, 1.0) * i * 0.75;
    }`,
};

function Arcs() {
  const group = useRef<THREE.Group>(null);
  const arcs = useMemo(
    () =>
      links.map(([a, b]) => {
        const s = toVec(...nodeCoords[a]);
        const e = toVec(...nodeCoords[b]);
        const mid = s.clone().add(e).multiplyScalar(0.5);
        const lift = 1 + s.distanceTo(e) * 0.28;
        return { s, e, mid: mid.normalize().multiplyScalar(R * lift) };
      }),
    [],
  );
  useFrame((_, dt) => {
    group.current?.children.forEach((line, i) => {
      const mat = (line as THREE.Mesh).material as THREE.Material & { dashOffset: number };
      if (mat && "dashOffset" in mat) mat.dashOffset -= dt * (0.25 + (i % 3) * 0.08);
    });
  });
  return (
    <group ref={group}>
      {arcs.map((a, i) => (
        <QuadraticBezierLine
          key={i}
          start={a.s}
          end={a.e}
          mid={a.mid}
          color="#1fcbfd"
          lineWidth={1.4}
          dashed
          dashScale={1}
          dashSize={0.5}
          gapSize={0.22}
          transparent
          opacity={0.75}
        />
      ))}
    </group>
  );
}

function Nodes() {
  const pts = useMemo(() => nodeCoords.map((c) => toVec(c[0], c[1], R * 1.01)), []);
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    ref.current?.children.forEach((m, i) => {
      const s = 1 + Math.sin(clock.elapsedTime * 2 + i) * 0.25;
      m.scale.setScalar(s);
    });
  });
  return (
    <group ref={ref}>
      {pts.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.028, 12, 12]} />
          <meshBasicMaterial color="#9fe7ff" toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

function Globe({ progressRef, tier }: { progressRef: RefObject<number>; tier: Tier }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state, dt) => {
    const g = group.current!;
    const p = progressRef.current ?? 0;
    g.rotation.y += dt * 0.06;
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, 0.35 - p * 0.25, 2, dt);
    // Slow camera orbit tied to scroll.
    const cam = state.camera;
    cam.position.x = THREE.MathUtils.damp(cam.position.x, Math.sin(p * 1.2 - 0.6) * 1.2, 2, dt);
    cam.lookAt(0, 0, 0);
  });
  return (
    <group ref={group} rotation={[0.35, 0, 0.12]}>
      <mesh>
        <sphereGeometry args={[R, 64, 64]} />
        <meshStandardMaterial color="#0a1c3f" emissive="#040e24" metalness={0.5} roughness={0.6} />
      </mesh>
      <DotShell count={tier === "high" ? 2200 : 1100} />
      <Nodes />
      <Arcs />
      <mesh scale={1.12}>
        <sphereGeometry args={[R, 48, 48]} />
        <shaderMaterial args={[atmosphere]} side={THREE.BackSide} blending={THREE.AdditiveBlending} transparent depthWrite={false} />
      </mesh>
    </group>
  );
}

export default function GlobeScene({ progressRef, visible, tier }: { progressRef: RefObject<number>; visible: boolean; tier: Tier }) {
  return (
    <Canvas
      frameloop={visible ? "always" : "never"}
      dpr={tier === "high" ? [1, 1.75] : [1, 1.25]}
      camera={{ position: [0, 0.2, 6.6], fov: 38 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      aria-hidden
    >
      <ambientLight intensity={0.25} color="#0a1c3f" />
      <directionalLight position={[-3, 2, 4]} intensity={1.6} color="#8cc8ff" />
      <pointLight position={[4, -1, -2]} intensity={30} distance={10} color="#1fcbfd" />
      <Globe progressRef={progressRef} tier={tier} />
      <Particles count={tier === "high" ? 160 : 80} radius={6} size={0.03} />
    </Canvas>
  );
}
