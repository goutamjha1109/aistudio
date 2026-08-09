"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { useRef, useCallback, useEffect } from "react";
import type { OrbitControls as OrbitControlsType } from "three-stdlib";
import * as THREE from "three"
import Model from "./Model";
import { useStore } from "../store/useStore";


const BASE_CAMERA_Z = 10;
const BASE_FOV = 30;


/*
 * Calculate camera distance based on the available
 * viewport aspect ratio.
 *
 * Desktop:
 *   aspect is wide -> camera stays around z = 10
 *
 * Mobile:
 *   aspect becomes narrow -> camera moves farther away
 *   so the complete assembly remains visible.
 */
function getCameraZ(width: number, height: number) {
    const aspect = width / height;

    if (aspect >= 1) {
        return BASE_CAMERA_Z;
    }

    return BASE_CAMERA_Z * Math.sqrt(1 / aspect) * 1.7;
}


/*
 * Keeps the camera responsive when the browser
 * changes size or orientation.
 */
function ResponsiveCamera({
    controlsRef,
    onReady,
}: {
    controlsRef: React.RefObject<OrbitControlsType | null>;
    onReady: (resetFn: () => void) => void;
}) {

    const { camera, size } = useThree();

    const reset = useCallback(() => {

        const z = getCameraZ(size.width, size.height);

        camera.position.set(0, 0, z);
        camera.lookAt(0, 0, 0);

        if (controlsRef.current) {
            controlsRef.current.target.set(0, 0, 0);
            controlsRef.current.reset();
        }

    }, [camera, controlsRef, size.width, size.height]);


    /*
     * Update camera whenever the viewport changes.
     */
    useEffect(() => {

    const z = getCameraZ(size.width, size.height);

    camera.position.set(0, 0, z);
    camera.lookAt(0, 0, 0);

    if (camera instanceof THREE.PerspectiveCamera) {
        camera.fov = BASE_FOV;
        camera.updateProjectionMatrix();
    }

    if (controlsRef.current) {
        controlsRef.current.target.set(0, 0, 0);
        controlsRef.current.saveState();
    }

    }, [
        camera,
        controlsRef,
        size.width,
        size.height,
    ]);


    /*
     * Give the parent access to the reset function.
     */
    useEffect(() => {
        onReady(reset);
    }, [reset, onReady]);


    return null;
}


export default function Viewer() {

    const resetViewerState = useStore(
        (s) => s.resetViewerState
    );

    const controlsRef =
        useRef<OrbitControlsType | null>(null);

    const resetCameraRef =
        useRef<(() => void) | null>(null);


    return (
        <div className="absolute inset-0">

            {/* Back to Library */}
            {/* Back to Library */}
        <button
            onClick={resetViewerState}
            className="
                fixed top-4 left-4 z-50
                flex items-center gap-2
                rounded-lg border border-gray-200 bg-white
                px-4 py-2 text-sm font-semibold
                text-gray-700 shadow-md
                hover:bg-gray-50 hover:text-blue-600
                transition-colors
            "
        >
            ← Library
        </button>

        {/* Reset View */}
        <button
            onClick={() => resetCameraRef.current?.()}
            className="
                fixed top-16 left-4 z-50
                flex items-center gap-2
                rounded-lg border border-gray-200 bg-white
                px-4 py-2 text-sm font-semibold
                text-gray-700 shadow-md
                hover:bg-gray-50 hover:text-blue-600
                transition-colors
            "
        >
            ⟳ Reset View
        </button>

            <Canvas
                camera={{
                    position: [0, 0, BASE_CAMERA_Z],
                    fov: BASE_FOV,
                }}
            >

                <Environment preset="city" />

                <axesHelper args={[1]} />

                <Model />

                <OrbitControls
                    ref={controlsRef}
                    makeDefault
                />

                <ResponsiveCamera
                    controlsRef={controlsRef}
                    onReady={(fn) => {
                        resetCameraRef.current = fn;
                    }}
                />

            </Canvas>

        </div>
    );
}