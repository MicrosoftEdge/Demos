import CopyWebpackPlugin from 'copy-webpack-plugin';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
    mode: 'development',
    // devtool: 'source-map',
    entry: {
        'dist/chat': './chat.js',
        'dist/check_coc': './check_coc.js',
        'dist/form_assistant': './form_assistant.js',
        'dist/issue_tagging': './issue_tagging.js',
    },
    output: {
        filename: '[name].js',
        path: __dirname,
        library: {
            type: 'module',
        },
    },
    plugins: [
        // Copy .wasm files to dist folder
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'node_modules/onnxruntime-web/dist/*.jsep.*',
                    to: 'dist/[name][ext]'
                },
            ],
        }),
    ],
    devServer: {
        static: {
            directory: __dirname
        },
        port: 8080
    },
    experiments: {
        outputModule: true,
    },
};
