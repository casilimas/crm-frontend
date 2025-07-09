export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  server: {
    port: 5173
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  // 👇 Agrega esto
  base: "/"
});
