"use client";

import { useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { StudioLights } from "./StudioLights";
import { Particles } from "./Particles";
import type { Tier } from "@/components/motion/ExperienceProvider";

/**
 * One shard system, six formations — one per service. Scroll progress morphs
 * the same crystal/chrome fragments between formations, passing through a
 * brief decomposition each time (echoing the hero's wolf → W story).
 *
 * Order matches data/services.ts: app, web, video, graphic, ads, social.
 */

type Formation = THREE.Vector3[];

// Deterministic pseudo-random so formations are identical between renders.
const rand = (seed: number) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

function along(points: THREE.Vector3[], n: number): THREE.Vector3[] {
  // Evenly distribute n positions along a closed/open polyline.
  const segs = points.slice(0, -1).map((p, i) => [p, points[i + 1], p.distanceTo(points[i + 1])] as const);
  const total = segs.reduce((a, s) => a + s[2], 0);
  return Array.from({ length: n }, (_, k) => {
    let d = (k / n) * total;
    for (const [a, b, len] of segs) {
      if (d <= len) return a.clone().lerp(b, d / len);
      d -= len;
    }
    return points[points.length - 1].clone();
  });
}

const v = (x: number, y: number, z = 0) => new THREE.Vector3(x, y, z);

function buildFormations(n: number): Formation[] {
  const edge = Math.round(n * 0.62);
  const rest = n - edge;

  // 01 App — a phone: rounded slab outline + interface rows.
  const phone = [
    ...along([v(-0.8, 1.55), v(0.8, 1.55), v(0.95, 1.4), v(0.95, -1.4), v(0.8, -1.55), v(-0.8, -1.55), v(-0.95, -1.4), v(-0.95, 1.4), v(-0.8, 1.55)], edge),
    ...Array.from({ length: rest }, (_, i) => v(-0.55 + (i % 4) * 0.37, 0.95 - Math.floor(i / 4) * 0.42, 0.08)),
  ];

  // 02 Web — layered browser windows receding in depth.
  const win = (z: number, ox: number, oy: number, count: number) =>
    along([v(-1.6 + ox, 1 + oy, z), v(1.6 + ox, 1 + oy, z), v(1.6 + ox, -1 + oy, z), v(-1.6 + ox, -1 + oy, z), v(-1.6 + ox, 1 + oy, z)], count);
  const w1 = Math.round(n * 0.45);
  const w2 = Math.round(n * 0.3);
  const web = [...win(0.4, 0, 0, w1), ...win(-0.5, 0.45, 0.35, w2), ...along([v(-1.6, 0.7, 0.42), v(1.6, 0.7, 0.42)], n - w1 - w2)];

  // 03 Video — play mark inside a lens ring.
  const tri = Math.round(n * 0.45);
  const video = [
    ...along([v(-0.55, 0.85), v(0.95, 0), v(-0.55, -0.85), v(-0.55, 0.85)], tri),
    ...Array.from({ length: n - tri }, (_, i) => {
      const a = (i / (n - tri)) * Math.PI * 2;
      return v(Math.cos(a) * 1.75, Math.sin(a) * 1.75, 0);
    }),
  ];

  // 04 Graphic — golden spiral.
  const graphic = Array.from({ length: n }, (_, i) => {
    const t = (i / n) * Math.PI * 4.2;
    const r = 0.12 * Math.exp(0.2 * t);
    return v(Math.cos(t) * r * 1.05, Math.sin(t) * r, Math.sin(t * 0.5) * 0.15);
  });

  // 05 Ads — target rings, slightly tilted, with a centre point.
  const rings = [0.45, 1.05, 1.7];
  const perRing = [Math.round(n * 0.18), Math.round(n * 0.32)];
  perRing.push(n - perRing[0] - perRing[1] - 4);
  const ads = [
    ...rings.flatMap((r, ri) =>
      Array.from({ length: perRing[ri] }, (_, i) => {
        const a = (i / perRing[ri]) * Math.PI * 2 + ri * 0.3;
        return v(Math.cos(a) * r, Math.sin(a) * r, 0);
      }),
    ),
    v(0, 0, 0.1), v(0.08, 0.05, 0.1), v(-0.06, 0.07, 0.1), v(0, -0.08, 0.1),
  ];

  // 06 Social — a network: Fibonacci sphere of nodes.
  const golden = Math.PI * (3 - Math.sqrt(5));
  const social = Array.from({ length: n }, (_, i) => {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const t = golden * i;
    return v(Math.cos(t) * r * 1.6, y * 1.6, Math.sin(t) * r * 1.6);
  });

  return [phone, web, video, graphic, ads, social].map((f) => f.slice(0, n));
}

const smooth = (t: number) => t * t * (3 - 2 * t);

function Shards({ activeRef, count }: { activeRef: RefObject<number>; count: number }) {
  const chrome = useRef<THREE.InstancedMesh>(null);
  const crystal = useRef<THREE.InstancedMesh>(null);
  const group = useRef<THREE.Group>(null);
  const formations = useMemo(() => buildFormations(count), [count]);
  const crystalEvery = 3; // every 3rd shard is blue crystal
  const nCrystal = Math.floor(count / crystalEvery);
  const nChrome = count - nCrystal;
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        rot: new THREE.Euler(rand(i) * Math.PI, rand(i + 99) * Math.PI, rand(i + 7) * Math.PI),
        spin: 0.2 + rand(i + 3) * 0.6,
        scale: 0.09 + rand(i + 11) * 0.08,
        burst: v(rand(i + 21) - 0.5, rand(i + 31) - 0.5, rand(i + 41) - 0.5).normalize(),
      })),
    [count],
  );
  const current = useRef(0);
  const tmp = useMemo(() => ({ m: new THREE.Matrix4(), q: new THREE.Quaternion(), p: new THREE.Vector3(), s: new THREE.Vector3(), e: new THREE.Euler() }), []);

  useFrame((state, dt) => {
    const target = activeRef.current ?? 0;
    current.current = THREE.MathUtils.damp(current.current, target, 4, dt);
    const f = THREE.MathUtils.clamp(current.current, 0, formations.length - 1);
    const a = Math.floor(f);
    const b = Math.min(a + 1, formations.length - 1);
    const t = smooth(f - a);
    const burst = Math.sin(Math.PI * t) * 0.9; // decomposition between formations
    const time = state.clock.elapsedTime;
    let ci = 0;
    let mi = 0;
    for (let i = 0; i < count; i++) {
      const sd = seeds[i];
      tmp.p.copy(formations[a][i]).lerp(formations[b][i], t).addScaledVector(sd.burst, burst);
      tmp.e.set(sd.rot.x + time * sd.spin * 0.3, sd.rot.y + time * sd.spin * 0.2, sd.rot.z);
      tmp.q.setFromEuler(tmp.e);
      const s = sd.scale * (1 + burst * 0.25);
      tmp.s.set(s * 0.7, s * 1.5, s * 0.7);
      tmp.m.compose(tmp.p, tmp.q, tmp.s);
      if (i % crystalEvery === 0 && ci < nCrystal) crystal.current!.setMatrixAt(ci++, tmp.m);
      else chrome.current!.setMatrixAt(mi++, tmp.m);
    }
    chrome.current!.instanceMatrix.needsUpdate = true;
    crystal.current!.instanceMatrix.needsUpdate = true;

    // Slow presentation turn + gentle pointer parallax.
    const g = group.current!;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, Math.sin(time * 0.25) * 0.35 + state.pointer.x * 0.25, 2, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -state.pointer.y * 0.15, 2, dt);
  });

  return (
    <group ref={group}>
      <instancedMesh ref={chrome} args={[undefined, undefined, nChrome]} frustumCulled={false}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#dbe6f7" metalness={0.8} roughness={0.22} envMapIntensity={2.2} flatShading />
      </instancedMesh>
      <instancedMesh ref={crystal} args={[undefined, undefined, nCrystal]} frustumCulled={false}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#0d79fd"
          emissive="#18acfd"
          emissiveIntensity={1.4}
          metalness={0.3}
          roughness={0.1}
          transparent
          opacity={0.9}
          flatShading
          toneMapped={false}
        />
      </instancedMesh>
      <EnergyRing activeRef={activeRef} />
    </group>
  );
}

/** Thin orbit of light that tilts as services change. */
function EnergyRing({ activeRef }: { activeRef: RefObject<number> }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state, dt) => {
    const m = ref.current!;
    const f = activeRef.current ?? 0;
    m.rotation.x = THREE.MathUtils.damp(m.rotation.x, 1.2 + f * 0.35, 2, dt);
    m.rotation.z += dt * 0.15;
  });
  return (
    <mesh ref={ref}>
      <torusGeometry args={[2.35, 0.006, 8, 160]} />
      <meshBasicMaterial color="#1fcbfd" transparent opacity={0.55} toneMapped={false} />
    </mesh>
  );
}

export default function ServicesScene({ activeRef, visible, tier }: { activeRef: RefObject<number>; visible: boolean; tier: Tier }) {
  const count = tier === "high" ? 72 : 48;
  return (
    <Canvas
      frameloop={visible ? "always" : "never"}
      dpr={tier === "high" ? [1, 1.75] : [1, 1.25]}
      camera={{ position: [0, 0, 7.2], fov: 35 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      aria-hidden
    >
      <StudioLights />
      <Shards activeRef={activeRef} count={count} />
      <Particles count={tier === "high" ? 220 : 110} radius={5} />
    </Canvas>
  );
}
