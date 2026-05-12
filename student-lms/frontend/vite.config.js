import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  base: "/student-lms-management-system/",
  plugins: [react()],
});
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
