export interface NodeData {
  label: string;
  color: string;
  shapeType: 'cube' | 'pyramid';
}

export interface CustomNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: NodeData;
}