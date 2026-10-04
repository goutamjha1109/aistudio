import { useGLTF } from "@react-three/drei";

import useSelection from "../hooks/useSelection";
import { useStore } from "../store/useStore";
import { useEffect } from "react";



export default function Model() {
    const selectedAssembly = useStore((s) => s.selectedAssembly);

    const isStreaming = useStore((s) => s.isStreaming);
    const partInfoLoading = useStore((s) => s.partInfoLoading);
    // Guarded by the parent (page.tsx) rendering Model only when an
    // assembly is selected — but a fallback keeps this safe either way.
    
    const { scene } = useGLTF(
        selectedAssembly ? `/api/models/${selectedAssembly}` : "/api/models/hooke-joint"
    );
    const { handleClick, handleHover, handlePointerOut, resetColors } =
        useSelection(scene);

    return (
        <primitive
            object={scene}
            position={[0, 0, 0]}
            scale={5}
            onPointerDown={handleClick}
            onPointerOver={handleHover}
            onPointerOut={handlePointerOut}
            onPointerMissed={() => {
                if (isStreaming || partInfoLoading) return;
                resetColors();
            }}
        />
    );
}
