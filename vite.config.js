import { defineConfig } from "vite";


const tiledPlugin = () => {
    return {
        name: 'tiled-tileset-plugin',
        resolveId: {
            order: 'pre',
            handler(sourceId, importer, options) {
                if (!sourceId.endsWith(".tsx")) return;
                return { id: 'tileset:' + sourceId, external: 'relative' }
            }
        }
    };
}

export default defineConfig({
    base: '/roleplay/',
    plugins: [tiledPlugin()],
    optimizeDeps: {
        exclude: ["excalibur"],
    },
    build: {
        assetsInlineLimit: 0, // excalibur cannot handle inlined xml in prod mode
        sourcemap: true,
        // Vite uses rollup currently for prod builds so a separate config is needed
        // to keep vite from bundling ESM together with commonjs
        rollupOptions: {
            output: {
                format: 'umd'
            }
        }
    }
});
