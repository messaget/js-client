module.exports = {
    target: 'webworker',
    mode: "production",

    entry: {
        main: './index.js',
    },
    output: {
        filename: (chunkData) => {
            return chunkData.chunk.name === 'main' ? 'web-bundle.js' : '[name]/[name].js';
        },
        path: __dirname,
        library: 'MessaGet',
        libraryTarget: "window"
    }
};
