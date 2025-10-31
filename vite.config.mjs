import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import autoprefixer from 'autoprefixer'

export default defineConfig(() => {
  return {
    base: './',
    build: {
      outDir: 'build',
      // Minification dengan terser untuk hasil lebih kecil
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true, // Hapus console.log di production
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info'], // Hapus specific functions
        },
      },
      // CSS code splitting untuk parallel loading
      cssCodeSplit: true,
      // Disable source maps untuk production (lebih kecil)
      sourcemap: false,
      // Rollup options untuk advanced optimization
      rollupOptions: {
        output: {
          // Manual chunks - split vendor code
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              // React core libraries
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
                return 'vendor-react';
              }
              // CoreUI components
              if (id.includes('@coreui')) {
                return 'vendor-coreui';
              }
              // DataTables & jQuery (heavy libraries)
              if (id.includes('datatables') || id.includes('jquery')) {
                return 'vendor-datatable';
              }
              // Chart libraries
              if (id.includes('chart.js')) {
                return 'vendor-chart';
              }
              // Redux & state management
              if (id.includes('redux') || id.includes('react-redux')) {
                return 'vendor-redux';
              }
              // Other node_modules
              return 'vendor-utils';
            }
          },
          // Optimized file naming untuk better caching
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        },
      },
      // Target modern browsers untuk smaller bundles
      target: 'es2015',
      // Chunk size warning
      chunkSizeWarningLimit: 500,
    },
    css: {
      postcss: {
        plugins: [
          autoprefixer({}), // add options if needed
        ],
      },
    },
    esbuild: {
      loader: 'jsx',
      include: /src\/.*\.jsx?$/,
      exclude: [],
    },
    optimizeDeps: {
      force: true,
      esbuildOptions: {
        loader: {
          '.js': 'jsx',
        },
      },
    },
    plugins: [react()],
    resolve: {
      alias: [
        {
          find: 'src/',
          replacement: `${path.resolve(__dirname, 'src')}/`,
        },
      ],
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.scss'],
    },
    server: {
      allowedHosts: ['kwh.sundaya.local'],
      host: '0.0.0.0',
      port: 3000,
      proxy: {
        // https://vitejs.dev/config/server-options.html
      },
    },
  }
})
