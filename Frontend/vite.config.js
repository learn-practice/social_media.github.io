import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false,
  },
  server:{
    port:3000,
    //Get rid of the CORS error
    proxy:{
      "/api":{
        target:"https://social-media-github-io.onrender.com",
        changeOrigin:true,
        secure:false,
      }
    }
  }
})
