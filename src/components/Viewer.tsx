"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { useRef, useCallback } from "react";
import type { OrbitControls as OrbitControlsType } from "three-stdlib";
import Model from "./Model";
import { useStore } from "../store/useStore";

const INITIAL_CAMERA = { position: [0, 0, 10] as [number, number, number], fov: 30 };

// Lives inside Canvas — has access to useThree
function CameraResetter({ 
  controlsRef,
  onReady,
}: { 
  controlsRef: React.RefObject<OrbitControlsType | null>;
  onReady: (resetFn: () => void) => void;
}) {
  const { camera } = useThree();

  const reset = useCallback(() => {
    // Reset camera position
    camera.position.set(...INITIAL_CAMERA.position);
    camera.lookAt(0, 0, 0);

    // Reset orbit controls target + zoom
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.reset(); // ← resets to initial state completely
    }
  }, [camera, controlsRef]);

  // Pass reset function up to parent
  useCallback(() => { onReady(reset); }, [reset, onReady])();

  return null;
}

export default function Viewer() {
  const resetViewerState = useStore((s) => s.resetViewerState);
  const controlsRef = useRef<OrbitControlsType>(null);
  const resetCameraRef = useRef<(() => void) | null>(null);

  return (
    <div className="w-full h-full relative">

      {/* Back to Library */}
      <button
        onClick={resetViewerState}
        className="absolute top-4 left-4 z-50 flex items-center gap-2 
          rounded-lg border border-gray-200 bg-white px-5 py-3 
          text-base font-semibold text-gray-700 shadow-md 
          hover:bg-gray-50 hover:text-blue-600 transition-colors"
      >
        ← Library
      </button>

      {/* Reset View button */}
      <button
        onClick={() => resetCameraRef.current?.()}
        className="absolute bottom-4 left-4 z-50 flex items-center gap-2
          rounded-lg border border-gray-200 bg-white px-4 py-2
          text-sm font-medium text-gray-700 shadow-md
          hover:bg-gray-50 hover:text-blue-600 transition-colors"
      >
        ⟳ Reset View
      </button>

      <Canvas camera={{ position: INITIAL_CAMERA.position, fov: INITIAL_CAMERA.fov }}>
        <Environment preset="city" />
        <axesHelper args={[1]} />
        <Model />
        <OrbitControls 
          ref={controlsRef}
          makeDefault
        />
        <CameraResetter
          controlsRef={controlsRef}
          onReady={(fn) => { resetCameraRef.current = fn; }}
        />
      </Canvas>

    </div>
  );
}