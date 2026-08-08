'use client';

import { useEffect } from 'react';
import { useStore } from '../store/useStore';

// Turns "hooke-joint" into "Hooke Joint"
function formatName(slug: string): string {
    return slug
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export default function LibraryScreen() {
    const availableAssemblies = useStore((s) => s.availableAssemblies);
    const assembliesLoading = useStore((s) => s.assembliesLoading);
    const fetchAssemblies = useStore((s) => s.fetchAssemblies);
    const setSelectedAssembly = useStore((s) => s.setSelectedAssembly);

    useEffect(() => {
        fetchAssemblies();
    }, [fetchAssemblies]);

    return (
        <div className="min-h-screen w-screen bg-gray-50 flex flex-col items-center justify-center p-8">

            <h1 className="text-3xl font-bold text-gray-800">
                AI Studio Library
            </h1>

            <p className="text-gray-500 mt-2 mb-10">
                Select an assembly to explore
            </p>

            {assembliesLoading && (
                <p>Loading library...</p>
            )}

            {!assembliesLoading && availableAssemblies.length === 0 && (
                <p>No assemblies available yet.</p>
            )}

            <div className="grid grid-cols-3 gap-6">
                {availableAssemblies.map((assembly) => (
                    <button
                        key={assembly}
                        onClick={() => setSelectedAssembly(assembly)}
                        className="w-48 h-40 rounded-xl border border-gray-200 bg-white shadow-md hover:shadow-lg hover:border-blue-400 transition-all duration-200 flex flex-col items-center justify-center"
                    >
                        <div className="text-5xl mb-4">🔩</div>

                        <div className="text-base font-semibold text-gray-800 text-center">
                            {formatName(assembly)}
                        </div>
                    </button>
                ))}
            </div>

        </div>
    );
}