"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";

import Model from "./Model"

export default function Viewer() {

    return (
        <div className="w-screen h-screen flex flex-col">
            <Canvas camera={{ position: [0, 0, 10], fov: 30 }} >
                {/* <ambientLight intensity={1.2} /> */}

                {/* <directionalLight
                    position={[-5,5,5]}
                    // position={[0,20,0]}
                    intensity={2}
                /> */}
                
                <Environment preset="city" />

                <axesHelper args={[1]} />
                <Model />
                <OrbitControls />
            </Canvas>
        </div>
        
    )

}
