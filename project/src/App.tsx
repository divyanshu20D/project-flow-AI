import React, { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import FlowCanvas from './components/FlowCanvas';

function App() {
  const [selectedColor, setSelectedColor] = useState('#c9f1dd');
  const [selectedShape, setSelectedShape] = useState<'cube' | 'pyramid'>('cube');
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const flowCanvasRef = React.useRef<{ addNode: () => void }>(null);

  const handleAddNode = useCallback(() => {
    flowCanvasRef.current?.addNode();
  }, []);

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      <Sidebar
        selectedColor={selectedColor}
        onColorChange={setSelectedColor}
        selectedShape={selectedShape}
        onShapeChange={setSelectedShape}
        zoomLevel={zoomLevel}
        onZoomChange={setZoomLevel}
        onAddNode={handleAddNode}
      />
      <FlowCanvas
        ref={flowCanvasRef}
        selectedColor={selectedColor}
        selectedShape={selectedShape}
        zoomLevel={zoomLevel}
      />
    </div>
  );
}

export default App;