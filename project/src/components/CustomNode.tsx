import React, { memo, useState, useCallback, useRef, useEffect } from 'react';
import { Handle, Position, NodeProps, useReactFlow, NodeResizer } from '@xyflow/react';
import { NodeData } from '../types/flowTypes';

const CustomNode = memo(({ id, data, selected }: NodeProps<NodeData>) => {
  const { label, color } = data;
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(label);
  const { setNodes } = useReactFlow();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
    setEditValue(label);
  }, [label]);

  const handleSubmit = useCallback(() => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, label: editValue } }
          : node
      )
    );
    setIsEditing(false);
  }, [id, editValue, setNodes]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(label);
    }
    // Don't prevent Enter key - let it create new lines
  }, [label]);

  const handleBlur = useCallback(() => {
    handleSubmit();
  }, [handleSubmit]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditValue(e.target.value);
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, []);

  // Auto-focus and resize when editing starts
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [isEditing]);

  return (
    <div className="relative">
      <NodeResizer
        color="#ff0071"
        isVisible={selected}
        minWidth={150}
        minHeight={60}
        maxWidth={500}
        maxHeight={300}
      />
      
      {/* Top Handle */}
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="!w-3 !h-3 !bg-white !border-2 !border-gray-400 !rounded-full hover:!border-gray-600 transition-colors"
      />
      
      {/* Left Handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="!w-3 !h-3 !bg-white !border-2 !border-gray-400 !rounded-full hover:!border-gray-600 transition-colors"
      />
      
      {/* Right Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="!w-3 !h-3 !bg-white !border-2 !border-gray-400 !rounded-full hover:!border-gray-600 transition-colors"
      />
      
      {/* Bottom Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="!w-3 !h-3 !bg-white !border-2 !border-gray-400 !rounded-full hover:!border-gray-600 transition-colors"
      />

      {/* Node Content */}
      <div 
        className="px-6 py-4 bg-white rounded-xl shadow-md border border-gray-200 w-full h-full hover:shadow-lg transition-shadow cursor-pointer flex items-center justify-center"
        style={{ borderLeftColor: color, borderLeftWidth: '4px' }}
        onDoubleClick={handleDoubleClick}
        title="Double-click to edit"
      >
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={editValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className="w-full text-gray-800 font-medium text-sm bg-transparent border-none outline-none resize-none overflow-hidden min-h-[20px]"
            style={{ 
              fontFamily: 'inherit',
              lineHeight: '1.4',
            }}
            placeholder="Enter node content..."
          />
        ) : (
          <div className="text-gray-800 font-medium text-sm whitespace-pre-wrap leading-relaxed">
            {label}
          </div>
        )}
      </div>
    </div>
  );
});

CustomNode.displayName = 'CustomNode';

export default CustomNode;