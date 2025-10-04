import React from 'react';

interface SidebarProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
  selectedShape: 'cube' | 'pyramid';
  onShapeChange: (shape: 'cube' | 'pyramid') => void;
  zoomLevel: number;
  onZoomChange: (zoom: number) => void;
  onAddNode: () => void;
}

const colors = [
  '#c9f1dd', '#e8f4fd', '#ffeaa7', '#fab1a0', '#fd79a8', 
  '#fdcb6e', '#6c5ce7', '#a29bfe', '#74b9ff', '#00b894'
];

const Sidebar: React.FC<SidebarProps> = ({
  selectedColor,
  onColorChange,
  selectedShape,
  onShapeChange,
  zoomLevel,
  onZoomChange,
  onAddNode
}) => {
  return (
    <div className="w-80 bg-white/90 backdrop-blur-sm shadow-xl border-r border-gray-200 p-6 space-y-6">
      {/* Add Node Button */}
      <button
        onClick={onAddNode}
        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
      >
        Add New Node
      </button>

      {/* Shape Color */}
      <div className="bg-white rounded-xl p-5 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">shape color</h3>
        <div className="flex items-center space-x-3 mb-4">
          <div 
            className="w-8 h-6 rounded shadow-md border-2 border-white"
            style={{ backgroundColor: selectedColor }}
          />
          <span className="text-sm font-mono text-gray-600">{selectedColor}</span>
        </div>
        <div className="grid grid-cols-5 gap-3">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => onColorChange(color)}
              className={`w-8 h-8 rounded-lg shadow-md hover:scale-110 transition-transform border-2 ${
                selectedColor === color ? 'border-gray-400' : 'border-white'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Shape Type */}
      <div className="bg-white rounded-xl p-5 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">shape type</h3>
        <div className="space-y-3">
          <label className="flex items-center space-x-3 cursor-pointer group">
            <div className="relative">
              <input
                type="radio"
                name="shapeType"
                value="cube"
                checked={selectedShape === 'cube'}
                onChange={(e) => onShapeChange(e.target.value as 'cube' | 'pyramid')}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded-full border-2 transition-all ${
                selectedShape === 'cube' 
                  ? 'border-pink-500 bg-pink-500' 
                  : 'border-gray-300 group-hover:border-pink-300'
              }`}>
                {selectedShape === 'cube' && (
                  <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                )}
              </div>
            </div>
            <span className="text-gray-700">cube</span>
          </label>
          
          <label className="flex items-center space-x-3 cursor-pointer group">
            <div className="relative">
              <input
                type="radio"
                name="shapeType"
                value="pyramid"
                checked={selectedShape === 'pyramid'}
                onChange={(e) => onShapeChange(e.target.value as 'cube' | 'pyramid')}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded-full border-2 transition-all ${
                selectedShape === 'pyramid' 
                  ? 'border-pink-500 bg-pink-500' 
                  : 'border-gray-300 group-hover:border-pink-300'
              }`}>
                {selectedShape === 'pyramid' && (
                  <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                )}
              </div>
            </div>
            <span className="text-gray-700">pyramid</span>
          </label>
        </div>
      </div>

      {/* Zoom Level */}
      <div className="bg-white rounded-xl p-5 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">zoom level</h3>
        <div className="space-y-3">
          <input
            type="range"
            min="0.1"
            max="2"
            step="0.1"
            value={zoomLevel}
            onChange={(e) => onZoomChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>0.1x</span>
            <span className="font-semibold text-pink-500">{zoomLevel.toFixed(1)}x</span>
            <span>2.0x</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;