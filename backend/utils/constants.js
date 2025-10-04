export const NODE_TYPES = {
    START: 'start',
    PROCESS: 'process',
    DECISION: 'decision',
    END: 'end'
};

export const SHAPE_TYPES = {
    CUBE: 'cube',
    PYRAMID: 'pyramid'
};

export const DEFAULT_COLORS = {
    START: '#4ade80',
    PROCESS: '#3b82f6',
    DECISION: '#fbbf24',
    END: '#ef4444',
    DEFAULT: '#c9f1dd'
};

export const API_ENDPOINTS = {
    GENERATE_FLOW: '/api/ai-flow/generate',
    GET_SUGGESTIONS: '/api/ai-flow/suggestions',
    GET_DIAGRAMS: '/api/diagrams',
    GET_DIAGRAM: '/api/diagrams/:id',
    UPDATE_DIAGRAM: '/api/diagrams/:id',
    DELETE_DIAGRAM: '/api/diagrams/:id'
};