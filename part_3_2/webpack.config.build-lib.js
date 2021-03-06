const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, argv) => {

    const conf = {
        mode: 'development',
        devServer: {
            open: true,
            openPage: [`client/example.html`],
            contentBase: path.join(__dirname, '/'),
            watchContentBase: true,
            port: 8080,
            host: argv.mode === 'production' ? `localhost` : `localhost`,
            disableHostCheck: true,
        },

        entry: {
            'mylib': [`./src/family.js`],
        },
        // library building properties for (3-2)
        output: {
            path: path.join(__dirname, '/'),
            filename: argv.mode === 'production' ? `[name].min.js` : `[name].develop.js`,
            library: {
                root: 'GreatFamily',
                amd: 'great-family',
                commonjs: 'common-great-family',
            },
            libraryExport: '',
            libraryTarget: 'umd',
            globalObject: 'this',
            umdNamedDefine: true,
            auxiliaryComment: {
                root: 'Comment for Root',
                commonjs: 'Comment for CommonJS',
                commonjs2: 'Comment for CommonJS2',
                amd: 'Comment for AMD'
            }
        },
        optimization: {
            minimizer: [new TerserPlugin({
                terserOptions: {
                    compress: {
                        drop_console: true,
                    },
                }
            })],
        },
        module: {
            rules: [{
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: [{
                    loader: 'babel-loader',
                }]
            }]
        },
    };

    if (argv.mode !== 'production') {
        conf.devtool = 'inline-source-map';
    }

    return conf;

};
