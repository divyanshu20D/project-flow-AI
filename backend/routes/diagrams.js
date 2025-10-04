import express from 'express';
import Diagram from '../models/Diagram.js';

const router = express.Router();

// Get all diagrams
router.get('/', async (req, res) => {
    try {
        const diagrams = await Diagram.find()
            .select('title description createdAt updatedAt')
            .sort({ createdAt: -1 });

        res.json({ diagrams });
    } catch (error) {
        console.error('Error fetching diagrams:', error);
        res.status(500).json({ error: 'Failed to fetch diagrams' });
    }
});

// Get specific diagram by ID
router.get('/:id', async (req, res) => {
    try {
        const diagram = await Diagram.findById(req.params.id);

        if (!diagram) {
            return res.status(404).json({ error: 'Diagram not found' });
        }

        res.json({ diagram });
    } catch (error) {
        console.error('Error fetching diagram:', error);
        res.status(500).json({ error: 'Failed to fetch diagram' });
    }
});

// Update diagram
router.put('/:id', async (req, res) => {
    try {
        const { title, description, nodes, edges } = req.body;

        const diagram = await Diagram.findByIdAndUpdate(
            req.params.id,
            {
                title,
                description,
                nodes,
                edges,
                updatedAt: Date.now()
            },
            { new: true }
        );

        if (!diagram) {
            return res.status(404).json({ error: 'Diagram not found' });
        }

        res.json({ diagram });
    } catch (error) {
        console.error('Error updating diagram:', error);
        res.status(500).json({ error: 'Failed to update diagram' });
    }
});

// Delete diagram
router.delete('/:id', async (req, res) => {
    try {
        const diagram = await Diagram.findByIdAndDelete(req.params.id);

        if (!diagram) {
            return res.status(404).json({ error: 'Diagram not found' });
        }

        res.json({ message: 'Diagram deleted successfully' });
    } catch (error) {
        console.error('Error deleting diagram:', error);
        res.status(500).json({ error: 'Failed to delete diagram' });
    }
});

export default router;