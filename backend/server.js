import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import aiFlowRoutes from './routes/ai-flow.js';
import diagramRoutes from './routes/diagrams.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3001'], // Vite dev server + demo page
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files (for demo page)
app.use(express.static('public'));

// Routes
app.use('/api/ai-flow', aiFlowRoutes);
app.use('/api/diagrams', diagramRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Flow Diagram Backend is running',
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route not found',
        path: req.originalUrl
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🤖 AI Flow API: http://localhost:${PORT}/api/ai-flow`);
    console.log(`📋 Diagrams API: http://localhost:${PORT}/api/diagrams`);
    console.log(`🎨 Demo Page: http://localhost:${PORT}/demo.html`);
});