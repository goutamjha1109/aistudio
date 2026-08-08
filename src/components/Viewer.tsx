"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";

import Model from "./Model";
import { useStore } from "../store/useStore";

export default function Viewer() {

    // const setSelectedAssembly = useStore(
    //     (s) => s.setSelectedAssembly
    // );
    const resetViewerState = useStore(
        (s) => s.resetViewerState
    );
    return (
        <div className="w-full h-full relative">

            <button
                onClick={() => {
                    resetViewerState();
                    // setSelectedAssembly(null);
                }}
                // onClick={() => setSelectedAssembly(null)}
                // className="absolute top-4 left-4 z-50 bg-white px-4 py-2 rounded-lg shadow hover:bg-gray-100"
                // className="absolute top-4 left-4 z-50 flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-md transition hover:bg-gray-50 hover:text-blue-600"
                className="absolute top-4 left-4 z-50 flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-3 text-base font-semibold text-gray-700 shadow-md transition hover:bg-gray-50 hover:text-blue-600"
            >
                ← Library
            </button>

            <Canvas camera={{ position: [0, 0, 10], fov: 30 }}>

                <Environment preset="city" />

                <axesHelper args={[1]} />

                <Model />

                <OrbitControls />

            </Canvas>

        </div>
    );
}