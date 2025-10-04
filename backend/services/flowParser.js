// Convert AI-generated flow data to React Flow format
export const parseFlowData = (aiResponse) => {
    const { nodes: aiNodes, connections } = aiResponse;

    // Convert nodes to React Flow format
    const nodes = aiNodes.map((node, index) => {
        // Calculate positions in a grid layout
        const gridWidth = Math.ceil(Math.sqrt(aiNodes.length));
        const row = Math.floor(index / gridWidth);
        const col = index % gridWidth;

        return {
            id: node.id,
            type: 'custom',
            position: {
                x: col * 250 + 100,
                y: row * 150 + 100
            },
            data: {
                label: node.label,
                color: getNodeColor(node.type, node.color),
                shapeType: node.shapeType || getShapeByType(node.type)
            }
        };
    });

    // Convert connections to React Flow edges
    const edges = connections.map((connection, index) => ({
        id: `edge-${index}`,
        source: connection.from,
        target: connection.to,
        type: 'default',
        label: connection.label || ''
    }));

    return { nodes, edges };
};

// Helper function to get color based on node type
const getNodeColor = (nodeType, customColor) => {
    if (customColor) return customColor;

    const colorMap = {
        start: '#4ade80',    // green
        process: '#3b82f6',  // blue
        decision: '#fbbf24', // yellow
        end: '#ef4444'       // red
    };

    return colorMap[nodeType] || '#c9f1dd';
};

// Helper function to get shape based on node type
const getShapeByType = (nodeType) => {
    return nodeType === 'decision' ? 'pyramid' : 'cube';
};

// Optimize node positions to avoid overlaps
export const optimizeLayout = (nodes, edges) => {
    // Simple force-directed layout simulation
    const optimizedNodes = [...nodes];

    // Add some spacing and organize by flow logic
    const startNodes = optimizedNodes.filter(n => n.data.label.toLowerCase().includes('start'));
    const endNodes = optimizedNodes.filter(n => n.data.label.toLowerCase().includes('end'));

    // Position start nodes at the top
    startNodes.forEach((node, index) => {
        node.position.y = 50;
        node.position.x = index * 300 + 150;
    });

    // Position end nodes at the bottom
    endNodes.forEach((node, index) => {
        node.position.y = Math.max(...optimizedNodes.map(n => n.position.y)) + 200;
        node.position.x = index * 300 + 150;
    });

    return optimizedNodes;
};