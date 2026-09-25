"use client";

import { Environment, Lightformer } from "@react-three/drei";

/**
 * Shared WOLVO lighting universe: deep navy ambience, royal/electric key,
 * cyan rim. The environment map is built from local Lightformers (no HDR
 * download) so reflections on chrome read as blue studio light.
 */
export function StudioLights({ intensity = 1 }: { intensity?: number }) {
  return (
    <>
      <ambientLight intensity={0.15 * intensity} color="#0a1c3f" />
      <directionalLight position={[4, 5, 3]} intensity={1.4 * intensity} color="#cfe4ff" />
      <pointLight position={[-4, -1, 2]} intensity={18 * intensity} distance={12} color="#0d79fd" />
      <pointLight position={[3.5, 1.5, -3]} intensity={22 * intensity} distance={12} color="#1fcbfd" />
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={2.2} color="#cfe4ff" position={[0, 4, -2]} scale={[8, 1.2, 1]} rotation-x={Math.PI / 2} />
        <Lightformer form="rect" intensity={3} color="#0d79fd" position={[-5, 0, 0]} scale={[1, 6, 1]} rotation-y={Math.PI / 2} />
        <Lightformer form="rect" intensity={3.5} color="#1fcbfd" position={[5, 0.5, 0]} scale={[1, 6, 1]} rotation-y={-Math.PI / 2} />
        <Lightformer form="ring" intensity={1.2} color="#18acfd" position={[0, 0, -6]} scale={4} />
      </Environment>
    </>
  );
}
