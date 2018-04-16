const webpack = require('webpack')
const path = require('path')

function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    entry: {
        app: './src/main.js'
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.vue', '.js', '.svg', '.css', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('src'),
            Components: path.resolve(__dirname, 'src/components/'),
            Ui: path.resolve(__dirname, 'src/ui/'),
            Common: path.resolve(__dirname, 'src/common/'),
            Scripts: path.resolve(__dirname, 'static/scripts')
        },
        symlinks: false
    },
    target: 'web',
    plugins: [
    ],
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    cssModules: {
                        localIdentName: '[local]--[hash:base64:5]'
                    }
                },
                include: [resolve('src')]
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve('src'), resolve('test')]
            },
            {
                test: /\.css$/,
                oneOf: [
                    {
                        include: [resolve('src')],
                        use: [
                            'style-loader',
                            {
                                loader: 'css-loader',
                                options: {
                                    modules: true,
                                    localIdentName: '[local]--[hash:base64:5]'
                                }
                            },
                            {
                                loader: 'postcss-loader',
                                options: {
                                    plugins: [require('autoprefixer')]
                                }
                            }
                        ]
                    },
                    {
                        include: [resolve('node_modules')],
                        use: ['style-loader', 'css-loader']
                    }
                ]
            },
            {
                test: /\.svg$/,
                loader: 'svg-sprite-loader'
            }
        ]
    }
}
