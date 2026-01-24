import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { exec } from 'child_process'

// Plugin to open Microsoft Edge after server is ready
function openEdgePlugin() {
  return {
    name: 'open-edge',
    configureServer(server) {
      server.httpServer?.once('listening', () => {
        const port = server.config.server.port || 5173
        const url = `http://localhost:${port}`
        
        // Wait a bit to ensure server is fully ready
        setTimeout(() => {
          const edgePaths = [
            'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
            'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
            'msedge'
          ]
          
          function tryOpenEdge(pathIndex = 0) {
            if (pathIndex >= edgePaths.length) {
              console.log(`\n✅ Server ready! Open manually: ${url}`)
              return
            }
            
            const edgePath = edgePaths[pathIndex]
            exec(`"${edgePath}" "${url}"`, (error) => {
              if (error && pathIndex < edgePaths.length - 1) {
                tryOpenEdge(pathIndex + 1)
              } else if (error) {
                console.log(`\n✅ Server ready! Open manually: ${url}`)
              } else {
                console.log(`\n✅ Opened ${url} in Microsoft Edge`)
              }
            })
          }
          
          tryOpenEdge()
        }, 1000)
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), openEdgePlugin()],
  server: {
    open: false, // Disable auto-open to prevent Cursor from intercepting
    port: 5173,
    host: true // Allow access from network
  }
})
