"use client"

import { Canvas } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"
import { useEffect } from "react";
import { OrbitControls } from "@react-three/drei";
import { Environment } from "@react-three/drei";
import * as THREE from "three"
import {ThreeEvent} from "@react-three/fiber";


function Model() {

    const { scene } = useGLTF("/models/Hooke/HookejointAsm.gltf");
    useEffect(() => {
        // scene.traverse((child) => {
        //     console.log(child.type, child.name);
        // });
        scene.traverse((child) => {

            if (child instanceof THREE.Mesh) {

                // Give every mesh its own material
                child.material = child.material.clone();

                const material = child.material as THREE.MeshStandardMaterial;

                // Store original color
                child.userData.originalColor = material.color.clone();
            }

        });
    }, [scene]);
    function handleClick(e: ThreeEvent<PointerEvent>) {

            e.stopPropagation();

            resetColors();

            const part = e.object.parent;

            console.log("Selected:", part?.name);

            part?.traverse((child : object) => {

                if (child instanceof THREE.Mesh) {

                    const material = child.material as THREE.MeshStandardMaterial;

                    material.color.set("#3100e0");
                }

            });

        }
    function resetColors() {
            scene.traverse((child) => {

                if (child instanceof THREE.Mesh) {

                    const material = child.material as THREE.MeshStandardMaterial;

                    material.color.copy(child.userData.originalColor);
                }

            });
        }
    return (
        <primitive
                object={scene}
                
                position={[0,0,0]}
                // rotation={[-Math.PI,0, Math.PI/2]}
                scale={10}
                onPointerDown={handleClick}
                onPointerMissed={() => {
                    resetColors();
                }}
            />
    );
}

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






/** 
function Model() {

    const { scene } = useGLTF("/models/Hooke/HookejointAsm.gltf");
    useEffect(() => {
        // scene.traverse((child) => {
        //     if (child.isMesh) {
        //          console.log({
        //             name: child.name,
        //             parent: child.parent?.name,
        //             geometry: child.geometry.uuid,
        //             material: child.material.name,
        //         });
        //     }
        // });
        scene.traverse((child) => {
            console.log(child.type, child.name);
        });
    }, [scene]);

    return (
        <primitive
                object={scene}
                position={[0,0,0]}
                // rotation={[-Math.PI,0, Math.PI/2]}
                scale={10}
            />
    );
}

**/