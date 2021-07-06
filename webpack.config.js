module.exports = {
    target: 'webworker',
    mode: "production",

    entry: {
        main: './messaget.js',
    },
    output: {
        filename: (chunkData) => {
            return chunkData.chunk.name === 'main' ? 'index.js' : '[name]/[name].js';
        },
        path: __dirname,
    }
};
