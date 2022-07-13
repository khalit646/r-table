const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const {CleanWebpackPlugin} =  require("clean-webpack-plugin")

module.exports = {
    mode: "development",
    context: path.resolve(__dirname, "src"),
    entry: "./index.jsx",
    output: {
        filename: "[contenthash].[name].bundle.js",
        path: path.resolve(__dirname, "dist")
    },
    optimization: {
        splitChunks: {
            chunks: "all"
        }
    },
    devtool: "source-map",
    devServer: {
        port: 5000,
        historyApiFallback: true
    },
    resolve: {
        extensions: [".js", ".jsx", "json"]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html"
        }),
        new CleanWebpackPlugin()
    ],
    module:{
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.s[ac]ss$/,
                use: ["style-loader", "css-loader", "sass-loader"]
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"]
                    }
                }
            },
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"]
                    }
                }
            }
        ]
    }
}