module.exports = function responseFormat(ok, meta, resData) {
    return {
        meta: {
            ok,
            ...meta
        },
        resData
    }
}
