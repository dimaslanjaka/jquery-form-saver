const path = require("path");

module.exports = {
    mode: "development",
    devtool: "inline-source-map",
    entry: {
        main: "./src/js/main.ts",
    },
    output: {
        path: path.resolve(__dirname, "./dist/release"),
        filename: "webpack-bundle.js", // <--- Will be compiled to this single file
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
            },
        ],
    },
};
