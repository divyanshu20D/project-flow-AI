import React, { useCallback, useRef } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap, 
  Node, 
  Edge, 
  Connection,
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
  ReactFlowInstance
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomNode from './CustomNode';
import { NodeData } from '../types/flowTypes';

interface FlowCanvasProps {
  selectedColor: string;
  selectedShape: 'cube' | 'pyramid';
  zoomLevel: number;
}

const nodeTypes = {
  custom: CustomNode,
};

const initialNodes: Node<NodeData>[] = [
  {
    id: '1',
    type: 'custom',
    position: { x: 250, y: 100 },
    data: { label: 'User Input\nRequirements Collection', color: '#c9f1dd', shapeType: 'cube' },
    style: { width: 200, height: 80 },
  },
  {
    id: '2',
    type: 'custom',
    position: { x: 400, y: 100 },
    data: { label: 'AI Processing\nGemini API Analysis\nDFD Generation', color: '#c9f1dd', shapeType: 'cube' },
    style: { width: 200, height: 100 },
  },
  {
    id: '3',
    type: 'custom',
    position: { x: 800, y: 50 },
    data: { label: 'Data Flow\nDiagram Output', color: '#e8f4fd', shapeType: 'cube' },
    style: { width: 200, height: 80 },
  },
  {
    id: '4',
    type: 'custom',
    position: { x: 800, y: 150 },
    data: { label: 'Client\nPresentation', color: '#e8f4fd', shapeType: 'cube' },
    style: { width: 200, height: 80 },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    sourceHandle: 'right',
    targetHandle: 'left',
    style: { stroke: '#94a3b8', strokeWidth: 2, strokeDasharray: '5,5' },
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    sourceHandle: 'right',
    targetHandle: 'left',
    style: { stroke: '#94a3b8', strokeWidth: 2, strokeDasharray: '5,5' },
  },
  {
    id: 'e2-4',
    source: '2',
    target: '4',
    sourceHandle: 'right',
    targetHandle: 'left',
    style: { stroke: '#94a3b8', strokeWidth: 2, strokeDasharray: '5,5' },
  },
];

const FlowCanvas = React.forwardRef<{ addNode: () => void }, FlowCanvasProps>(({ 
  selectedColor, 
  selectedShape, 
  zoomLevel
}, ref) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = React.useState<ReactFlowInstance | null>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({
      ...params,
      style: { stroke: '#94a3b8', strokeWidth: 2, strokeDasharray: '5,5' },
    }, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowInstance) return;

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!reactFlowBounds) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode: Node<NodeData> = {
        id: `node_${Date.now()}`,
        type: 'custom',
        position,
        data: { 
          label: 'New Node',
          color: selectedColor,
          shapeType: selectedShape
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, selectedColor, selectedShape, setNodes]
  );

  const addNode = useCallback(() => {
    const newNode: Node<NodeData> = {
      id: `node_${Date.now()}`,
      type: 'custom',
      position: { 
        x: Math.random() * 400 + 100, 
        y: Math.random() * 300 + 100 
      },
      data: { 
        label: 'New Node',
        color: selectedColor,
        shapeType: selectedShape
      },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [selectedColor, selectedShape, setNodes]);

  // Expose addNode function to parent
  React.useImperativeHandle(ref, () => ({
    addNode
  }));

  React.useEffect(() => {
    if (reactFlowInstance) {
      reactFlowInstance.setViewport({ x: 0, y: 0, zoom: zoomLevel });
    }
  }, [zoomLevel, reactFlowInstance]);

  return (
    <div className="flex-1 h-screen" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
        className="bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100"
        connectionLineStyle={{ stroke: '#94a3b8', strokeWidth: 2, strokeDasharray: '5,5' }}
      >
        <Background 
          variant="dots" 
          gap={20} 
          size={1} 
          color="#e2e8f0"
        />
        <Controls 
          className="!bg-white/90 !backdrop-blur-sm !border-gray-200 !shadow-lg"
        />
        <MiniMap 
          className="!bg-white/90 !backdrop-blur-sm !border-gray-200"
          nodeColor="#ff0071"
        />
      </ReactFlow>
    </div>
  );
});

const FlowCanvasWrapper = React.forwardRef<{ addNode: () => void }, FlowCanvasProps>((props, ref) => {
  const flowRef = React.useRef<{ addNode: () => void }>(null);
  
  React.useImperativeHandle(ref, () => ({
    addNode: () => flowRef.current?.addNode()
  }));

  return (
    <ReactFlowProvider>
      <FlowCanvas {...props} ref={flowRef} />
    </ReactFlowProvider>
  );
});

FlowCanvasWrapper.displayName = 'FlowCanvasWrapper';

export default FlowCanvasWrapper;