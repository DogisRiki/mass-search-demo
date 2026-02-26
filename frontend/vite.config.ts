/// <reference types="vitest/config" />
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    plugins: [react(), tailwindcss(), tsconfigPaths()],
    server: {
        host: true,
        watch: {
            ignored: ["**/node_modules/**", "**/.git/**", "**/dist/**", "**/coverage/**"],
        },
    },
    test: {
        globals: true,
        environment: "happy-dom",
        setupFiles: ["./vitest-setup.ts"],
        reporters: ["default", ["junit", { outputFile: "test-results/junit.xml" }]],
        css: false,
    },
});
