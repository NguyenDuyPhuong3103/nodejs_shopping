module.exports = function responseFormat(ok, meta, data) {
    return {
        meta: {
            ok,
            ...meta
        },
        data
    }
}
