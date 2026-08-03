// import Viewer from "@/components/Viewer";


// export default function Home() {
//   return (
//     <>
//       <h1>AI Studio </h1>
//       <Viewer />
    
//     </>
//   )
// }


import Viewer from "@/components/Viewer";
import InfoPanel from "@/components/InfoPanel";

export default function Home() {
  return (
    <div className="w-screen h-screen flex overflow-hidden bg-gray-100">
      
      {/* 3D Viewer — takes up left 60% */}
      <div className="flex-1 relative">
        <Viewer />
      </div>

      {/* AI Chat Panel — fixed 380px right side */}
      <div className="w-[480px] min-w-[480px] bg-white border-l border-gray-200 flex flex-col">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 bg-white">
          <h1 className="text-sm font-bold text-gray-800">AI Studio</h1>
          <p className="text-[10px] text-gray-400">
            Click a part to get engineering insights
          </p>
        </div>

        {/* Panel content */}
        <div className="flex-1 overflow-hidden">
          <InfoPanel />
        </div>
      </div>

    </div>
  );
}