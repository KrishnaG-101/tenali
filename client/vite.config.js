/**
 * VITE BUILD CONFIGURATION - MAIN CLIENT
 *
 * Configuration file for Vite (build tool and development server) for the main Tenali client.
 * Defines how React components are built and how the development server proxies API requests.
 *
 * This is the unified entry point for the Tenali platform that aggregates multiple quiz modules.
 *
 * Build Configuration:
 * - React plugin: Enables JSX/React syntax support
 * - Base path: '/' (serves from root, no subdirectory)
 * - Outputs to dist directory after build
 *
 * Development Server:
 * - Host: 0.0.0.0 (accessible from any IP)
 * - Port: 5173 (standard Vite default port)
 * - Proxying: Redirects API calls to backend services on port 4000
 *
 * API Proxy Routes:
 * All API requests are proxied to a central backend at http://127.0.0.1:4000
 * This allows the dev server and different modules to be served from a single origin
 * without CORS issues during development.
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Serves from root path (no /sub/path)
  base: '/',
  // Enable React support for JSX compilation
  plugins: [react()],
  server: {
    // Listen on all network interfaces (0.0.0.0) for development
    host: '0.0.0.0',
    // Development server port
    port: 5173,
    // API proxy configuration: Forward API requests to backend services
    proxy: {
      // Primary API endpoint - routes to main quiz service
      '/api': { target: 'http://127.0.0.1:4000', changeOrigin: true },
      // Automatically proxy all *-api quiz endpoints (e.g. /gk-api, /dotprod-api, /section-api)
      '^/[a-zA-Z0-9_-]+-api': { target: 'http://127.0.0.1:4000', changeOrigin: true },
    },
  },
})
