const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: "development",
    target: "node",
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: ['ts-loader', 'source-map-loader'],
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: "/",
        clean: true,
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                "public"
            ],
        }),
    ],
    devtool: "source-map"
};