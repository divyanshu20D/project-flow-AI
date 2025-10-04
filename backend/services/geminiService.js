import { google } from '@ai-sdk/google';
import { generateObject, streamObject } from 'ai';
import { z } from 'zod';

// Schema for the AI response
const flowDiagramSchema = z.object({
    title: z.string().describe('Title of the flow diagram'),
    description: z.string().describe('Brief description of the diagram'),
    nodes: z.array(z.object({
        id: z.string().describe('Unique identifier for the node'),
        label: z.string().describe('Text label for the node'),
        type: z.enum(['start', 'process', 'decision', 'end']).describe('Type of node in the flow'),
        color: z.string().optional().describe('Hex color code for the node'),
        shapeType: z.enum(['cube', 'pyramid']).optional().describe('3D shape type')
    })),
    connections: z.array(z.object({
        from: z.string().describe('Source node ID'),
        to: z.string().describe('Target node ID'),
        label: z.string().optional().describe('Label for the connection')
    }))
});

export const generateFlowDiagram = async (prompt) => {
    try {
        const result = await generateObject({
            model: google('gemini-1.5-flash'),
            schema: flowDiagramSchema,
            prompt: `Create a flow diagram based on this description: "${prompt}". 
      
      Guidelines:
      - Create logical flow with clear start and end points
      - Use appropriate node types (start, process, decision, end)
      - Keep labels concise but descriptive
      - Ensure connections make logical sense
      - Use colors that represent the flow type (green for start, blue for process, yellow for decision, red for end)
      - Choose appropriate 3D shapes (cube for most nodes, pyramid for decision points)
      
      The diagram should be practical and easy to understand.`
        });

        return result.object;
    } catch (error) {
        console.error('Gemini API error:', error);
        throw new Error('Failed to generate flow diagram with AI');
    }
};
// Streaming version for real-time updates
export const generateFlowDiagramStream = async (prompt) => {
    try {
        const result = await streamObject({
            model: google('gemini-1.5-flash'),
            schema: flowDiagramSchema,
            prompt: `Create a flow diagram based on this description: "${prompt}". 
      
      Guidelines:
      - Create logical flow with clear start and end points
      - Use appropriate node types (start, process, decision, end)
      - Keep labels concise but descriptive
      - Ensure connections make logical sense
      - Use colors that represent the flow type (green for start, blue for process, yellow for decision, red for end)
      - Choose appropriate 3D shapes (cube for most nodes, pyramid for decision points)
      
      The diagram should be practical and easy to understand.`
        });

        return result;
    } catch (error) {
        console.error('Gemini streaming error:', error);
        throw new Error('Failed to stream flow diagram generation');
    }
};