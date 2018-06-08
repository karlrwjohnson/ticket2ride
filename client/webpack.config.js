const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        index: './src/index',
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[hash].js',
    },

    module: {
        rules: [
            {
                test: /\.jsx?$/,
                include: [ path.resolve(__dirname, 'src') ],
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env', '@babel/preset-react'],
                        }
                    }
                ],
            },
            {
                test: /\.html?$/,
                use: [
                    {
                        loader: 'html-loader',
                    }
                ],
            },
            {
                test: /\.scss?$/,
                use: [
                    'style-loader', // creates style nodes from JS strings
                    'css-loader', // translates CSS into CommonJS
                    'sass-loader', // compiles Sass to CSS
                ],
            },
        ],
    },

    plugins: [
        new HtmlWebpackPlugin({
            filename: path.resolve(__dirname, 'dist', 'index.html'),
            title: 'Ticket 2 Ride',
            meta: {
                viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0',
            }
        }),
    ],

    resolve: {
        modules: [
            'node_modules',
            path.resolve(__dirname, 'src'),
        ],
        extensions: ['.js', '.json', '.jsx', '.css', '.scss'],
    },

    // webpack-serve
    serve: {
        host: '0.0.0.0',
        port: 8000,
    },
};
