module.exports = function(api) {
    api.cache(false)
    return {
        ignore: [],
        plugins: [],
        presets: [
            [
                '@babel/preset-env',
                {
                    modules: false,
                    useBuiltIns: 'usage',
                    debug: false,
                    loose: false,
                    spec: false,
                },
            ],
        ],
    }
}
