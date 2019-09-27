const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

const isProduction = typeof process.env.NODE_ENV !== 'undefined' && process.env.NODE_ENV === 'production';
const mode = isProduction ? 'production' : 'development';
const devtool = isProduction ? false : 'inline-source-map';


module.exports =   {
    entry: './src/server.ts',
    target: 'node',
    mode,
    devtool,
    externals: [nodeExternals()],
    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader',
                exclude: /node_modules/,
            },

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader'
            },
        ]
    },
    resolve: {
        extensions: [ '.tsx', '.ts'],
        plugins: [
            new TsconfigPathsPlugin({configFile: './tsconfig.json'})
        ]
    },
    output: {
        filename: 'server.js',
        path: path.resolve(__dirname, 'build')
    },
    node: {
        __dirname: false,
        __filename: false,
    },
};


