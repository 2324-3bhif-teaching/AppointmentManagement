const path = require('path');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
    entry: {
        admin: './src/public/scripts/admin.ts',
        visitor: './src/public/scripts/visitor.ts',
        index: './src/public/scripts/index.ts',
        login: './src/public/scripts/login.ts'
    },
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, 'src/public/scripts/dist')
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            crypto: 'crypto-browserify',
            stream: 'stream-browserify',
            buffer: 'buffer'
        },
        fallback: {
            "crypto": require.resolve("crypto-browserify"),
            "stream": require.resolve("stream-browserify"),
            "buffer": require.resolve("buffer/")
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new NodePolyfillPlugin()
    ]
};
