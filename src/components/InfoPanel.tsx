'use client';

import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Send, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';


export default function InfoPanel() {
    const selectedPartName = useStore((s) => s.selectedPartName);
    const partInfoLoading = useStore((s) => s.partInfoLoading);
    const partInfoAnswer = useStore((s) => s.partInfoAnswer);
    const partInfoError = useStore((s) => s.partInfoError);
    const fetchPartInfo = useStore((s) => s.fetchPartInfo);

    const [question, setQuestion] = useState('');

    const handleAsk = () => {
    if (!selectedPartName || partInfoLoading) return;
    fetchPartInfo(selectedPartName, question || undefined);
    setQuestion('');
    };

    // Nothing selected yet
    if (!selectedPartName) {
    return (
        <div className="h-full flex flex-col items-center justify-center text-gray-400 p-6 text-center">
        <div className="text-4xl mb-3">🔩</div>
        <p className="text-sm font-medium">Click a part in the 3D viewer</p>
        <p className="text-xs mt-1">to get AI engineering insights</p>
        </div>
    );
    }

    return (
    <div className="h-full flex flex-col">
        {/* Part name header */}
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">
            Selected Part
        </p>
        <p className="text-sm font-semibold text-gray-800 capitalize">
            {selectedPartName.replace(/_\d+$/, '')}
        </p>
        </div>

        {/* Answer area */}
        <div className="flex-1 overflow-y-auto p-4">
        {!partInfoAnswer && !partInfoLoading && !partInfoError && (
            <p className="text-large text-gray-500 text-center mt-8">
            Ask a question or wait for the default answer...
            </p>
        )}

        {partInfoLoading && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
            <Loader2 size={14} className="animate-spin text-blue-500" />
            Asking AI...
            </div>
        )}

        {partInfoError && (
            <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">
            {partInfoError}
            </p>
        )}
        {partInfoAnswer && (
            <div className="bg-blue-50 rounded-lg px-4 py-3 border border-blue-100 prose prose-sm max-w-none text-gray-800">
                <ReactMarkdown>
                {partInfoAnswer}
                </ReactMarkdown>
                <span className="animate-pulse text-gray-400">▌</span>
            </div>
        )}
        </div>

        {/* Question input */}
        {/* Question input */}
        <div className="px-4 py-3 border-t border-gray-200 shrink-0">
            <div className="flex gap-2 items-end">
                <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleAsk(); }}
                    placeholder="Ask about this part..."
                    className="flex-1 text-base sm:text-lg px-4 py-4 rounded-lg border border-gray-200
                        focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400
                        placeholder:text-gray-40 bg-white text-gray-800"
                />
                <button
                    onClick={handleAsk}
                    disabled={partInfoLoading || !selectedPartName}
                    className="px-4 py-3 rounded-lg bg-blue-500 text-white 
                        hover:bg-blue-600 disabled:opacity-40 transition-colors
                        flex items-center justify-center shrink-0"
                >
                    {partInfoLoading
                        ? <Loader2 size={16} className="animate-spin" />
                        : <Send size={16} />
                    }
                </button>
            </div>
        </div>
    </div>
    );
}