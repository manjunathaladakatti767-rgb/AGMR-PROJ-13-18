// Centralized API configuration
// This allows the app to switch between localhost and production URLs automatically

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const SAFETY_ENGINE_URL = import.meta.env.VITE_SAFETY_URL || 'http://localhost:5001';
