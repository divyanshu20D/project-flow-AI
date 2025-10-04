import mongoose from 'mongoose';

const nodeSchema = new mongoose.Schema({
    id: { type: String, required: true },
    type: { type: String, default: 'custom' },
    position: {
        x: { type: Number, required: true },
        y: { type: Number, required: true }
    },
    data: {
        label: { type: String, required: true },
        color: { type: String, default: '#c9f1dd' },
        shapeType: { type: String, enum: ['cube', 'pyramid'], default: 'cube' }
    }
});

const edgeSchema = new mongoose.Schema({
    id: { type: String, required: true },
    source: { type: String, required: true },
    target: { type: String, required: true },
    type: { type: String, default: 'default' }
});

const diagramSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    prompt: { type: String, required: true }, // Original AI prompt
    nodes: [nodeSchema],
    edges: [edgeSchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

diagramSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export default mongoose.model('Diagram', diagramSchema);