import * as THREE from "three";
import { ThreeEvent } from "@react-three/fiber"
import { useEffect } from "react";
import { useRef } from "react";
import { useStore } from '../store/useStore';

export default function useSelection(scene: THREE.Group ){
    const selectedPart = useRef<THREE.Object3D | null>(null);
    const setSelectedPart = useStore((s) => s.setSelectedPart);
    // const fetchPartInfo = useStore((s) => s.fetchPartInfo);
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

                child.userData.originalEmissive =
                    material.emissive.clone();

                child.userData.originalEmissiveIntensity =
                    material.emissiveIntensity;
            }

        });
    }, [scene]);

    function handleHover(e: ThreeEvent<PointerEvent>) {
    
            e.stopPropagation();
    
            const part = e.object.parent;
    
            part?.traverse((child) => {
    
                if (child instanceof THREE.Mesh) {
    
                    const material =
                        child.material as THREE.MeshStandardMaterial;
    
                    // Keep the same colour
                    material.emissive.copy(material.color);
    
                    // Just make it glow slightly
                    material.emissiveIntensity = 0.8;
                }
    
            });
    
        }
        
    function handlePointerOut(e: ThreeEvent<PointerEvent>) {

        const part = e.object.parent;

        part?.traverse((child) => {

            if (child instanceof THREE.Mesh) {

                const material =
                    child.material as THREE.MeshStandardMaterial;

                material.emissive.copy(
                    child.userData.originalEmissive
                );

                material.emissiveIntensity =
                    child.userData.originalEmissiveIntensity;
            }

        });

    }
    function handleClick(e: ThreeEvent<PointerEvent>) {

            e.stopPropagation();
            // Remove hover glow first 
            handlePointerOut(e);

            // resetColors();

            const part = e.object.parent;

            console.log("Selected:", part?.name);

            if (!part) return;
            if (selectedPart.current === part) return;

            // 1. Deselect previous part
            if (selectedPart.current) {

                selectedPart.current.traverse((child) => {

                    if (child instanceof THREE.Mesh) {

                        const material = child.material as THREE.MeshStandardMaterial;

                        material.color.copy(child.userData.originalColor);

                    }

                });

            }
            part?.traverse((child) => {

                if (child instanceof THREE.Mesh) {

                    const material = child.material as THREE.MeshStandardMaterial;

                    material.color.set("#3100e0");
                }

            });
            selectedPart.current = part;
            setSelectedPart(part.name);        // ← tell the store which part is selected
            // fetchPartInfo(part.name);          // ← trigger AI fetch
            if (!part) return;

        }
    function resetColors() {
            scene.traverse((child) => {

                if (child instanceof THREE.Mesh) {

                    const material = child.material as THREE.MeshStandardMaterial;

                    material.color.copy(child.userData.originalColor);
                }

            });
        }

        return {
            handleClick,
            handleHover,
            resetColors,
            handlePointerOut
        };
}