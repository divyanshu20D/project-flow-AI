import express from 'express';
import { generateFlowDiagram, generateFlowDiagramStream } from '../services/geminiService.js';
import { parseFlowData, optimizeLayout } from '../services/flowParser.js';
import Diagram from '../models/Diagram.js';

const router = express.Router();

// Generate flow diagram from AI prompt
router.post('/generate', async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt || prompt.trim().length === 0) {
            return res.status(400).json({
                error: 'Prompt is required'
            });
        }

        console.log('Generating flow diagram for prompt:', prompt);

        // Generate diagram using Gemini AI
        const aiResponse = await generateFlowDiagram(prompt);
        console.log('AI Response:', JSON.stringify(aiResponse, null, 2));

        // Parse AI response to React Flow format
        const { nodes, edges } = parseFlowData(aiResponse);

        // Optimize layout
        const optimizedNodes = optimizeLayout(nodes, edges);

        // Save to database
        const diagram = new Diagram({
            title: aiResponse.title,
            description: aiResponse.description,
            prompt: prompt,
            nodes: optimizedNodes,
            edges: edges
        });

        const savedDiagram = await diagram.save();

        res.json({
            success: true,
            diagram: {
                id: savedDiagram._id,
                title: savedDiagram.title,
                description: savedDiagram.description,
                nodes: optimizedNodes,
                edges: edges,
                createdAt: savedDiagram.createdAt
            }
        });

    } catch (error) {
        console.error('Error generating flow diagram:', error);
        res.status(500).json({
            error: 'Failed to generate flow diagram',
            details: error.message
        });
    }
});

// Get suggestions for flow diagram prompts
router.get('/suggestions', (req, res) => {
    const suggestions = [
        "Create a user registration process flow",
        "Design an e-commerce checkout workflow",
        "Build a customer support ticket system flow",
        "Map out a software development lifecycle",
        "Create a data processing pipeline",
        "Design a content approval workflow",
        "Build a project management process",
        "Create an employee onboarding flow"
    ];

    res.json({ suggestions });
});

export default router;
// Stream flow diagram generation(real - time updates)
router.post('/generate-stream', async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt || prompt.trim().length === 0) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        // Set headers for Server-Sent Events
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Cache-Control'
        });

        console.log('Starting stream generation for prompt:', prompt);

        const stream = await generateFlowDiagramStream(prompt);

        // Send progress updates
        res.write(`data: ${JSON.stringify({ type: 'progress', message: 'AI is thinking...' })}\n\n`);

        let partialObject = {};

        for await (const delta of stream.partialObjectStream) {
            partialObject = { ...partialObject, ...delta };

            // Send partial updates to frontend
            res.write(`data: ${JSON.stringify({
                type: 'partial',
                data: partialObject
            })}\n\n`);
        }

        // Get final result
        const finalResult = await stream.object;

        // Parse and optimize
        const { nodes, edges } = parseFlowData(finalResult);
        const optimizedNodes = optimizeLayout(nodes, edges);

        // Save to database
        const diagram = new Diagram({
            title: finalResult.title,
            description: finalResult.description,
            prompt: prompt,
            nodes: optimizedNodes,
            edges: edges
        });

        const savedDiagram = await diagram.save();

        // Send final result
        res.write(`data: ${JSON.stringify({
            type: 'complete',
            diagram: {
                id: savedDiagram._id,
                title: savedDiagram.title,
                description: savedDiagram.description,
                nodes: optimizedNodes,
                edges: edges,
                createdAt: savedDiagram.createdAt
            }
        })}\n\n`);

        res.end();

    } catch (error) {
        console.error('Error in stream generation:', error);
        res.write(`data: ${JSON.stringify({
            type: 'error',
            error: error.message
        })}\n\n`);
        res.end();
    }
});