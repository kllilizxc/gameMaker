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
        extensions: ['.vue', '.js', '.svg', '.css', '.less', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('src'),
            Components: path.resolve(__dirname, 'src/components/'),
            Ui: path.resolve(__dirname, 'src/ui/'),
            Common: path.resolve(__dirname, 'src/ui/')
        },
        symlinks: false
    },
    target: 'electron',
    module: {
        rules: [
            // {
            //     test: /\.(js|vue)$/,
            //     loader: 'eslint-loader',
            //     enforce: 'pre',
            //     include: [resolve('src'), resolve('test')],
            //     options: {
            //         formatter: require('eslint-friendly-formatter')
            //     }
            // },
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
                test: /\.ts(x?)$/,
                loader: 'babel-loader!ts-loader'
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
            },
            {
                test: /\.(png|jpe?g|gif)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'static/img/[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'static/media/[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'static/fonts/[name].[hash:7].[ext]'
                }
            }
        ]
    }
}
