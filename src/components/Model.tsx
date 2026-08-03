import { useGLTF,
         
 } from "@react-three/drei";

import * as THREE from "three";
import { useEffect } from "react";


import useSelection from "../hooks/useSelection"

import { ThreeEvent } from "@react-three/fiber";

export default function Model() {

    const { scene } = useGLTF("/models/Hooke/HookejointAsm.gltf");
    const {
            handleClick,
            handleHover,
            handlePointerOut,
            resetColors,
        } = useSelection(scene);
    

    return (
        <primitive
                object={scene}
                
                position={[0,0,0]}
                // rotation={[-Math.PI,0, Math.PI/2]}
                scale={5}
                onPointerDown={handleClick}
                onPointerOver={handleHover}
                onPointerOut={handlePointerOut}
                onPointerMissed={() => {
                    resetColors();
                }}
            />
    );
}